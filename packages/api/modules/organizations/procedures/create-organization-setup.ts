import { ORPCError } from "@orpc/server";
import { auth } from "@repo/auth";
import {
	createBranch,
	createOrganizationProfile,
	getCountryByCode,
	getOrganizationBySlug,
} from "@repo/database";
import { z } from "zod";

import { protectedProcedure } from "../../../orpc/procedures";

export const createOrganizationSetup = protectedProcedure
	.route({
		method: "POST",
		path: "/organizations/setup",
		tags: ["Organizations"],
		summary: "Create organization during onboarding",
		description:
			"Create organization with business details, default branch, and set as active",
	})
	.input(
		z.object({
			name: z.string().min(2).max(100),
			slug: z.string().min(2).max(50),
			industryCode: z.string(),
			countryCode: z.string(),
			city: z.string().optional(),
			timezone: z.string().optional(),
		}),
	)
	.handler(async ({ context: { user, headers }, input }) => {
		const { name, slug, industryCode, countryCode, city, timezone } = input;

		// Verify slug is available
		const existingSlug = await getOrganizationBySlug(slug);
		if (existingSlug) {
			throw new ORPCError("BAD_REQUEST", {
				message: "Organization slug is already taken",
			});
		}

		// Verify country exists and get currency
		const countryRow = await getCountryByCode(countryCode);

		if (!countryRow) {
			throw new ORPCError("BAD_REQUEST", {
				message: "Invalid country code",
			});
		}

		const currencyCode = countryRow.currencyCode;

		// Create organization using Better Auth (creates org + member with owner role)
		const organization = await auth.api.createOrganization({
			body: {
				name,
				slug,
			},
			headers,
		});

		if (!organization?.id) {
			throw new ORPCError("INTERNAL_SERVER_ERROR", {
				message: "Failed to create organization",
			});
		}

		// Create organization profile with business details
		await createOrganizationProfile({
			organizationId: organization.id,
			industryCode,
			countryCode,
			currencyCode,
			timezone: timezone ?? "America/La_Paz",
			city: city ?? null,
		});

		// Create default branch
		await createBranch({
			organizationId: organization.id,
			name,
			isDefault: true,
			countryCode,
			city: city ?? null,
			socialLinks: {},
		});

		// Set organization as active for user
		await auth.api.setActiveOrganization({
			body: {
				organizationId: organization.id,
			},
			headers,
		});

		// Mark onboarding as complete
		await auth.api.updateUser({
			body: {
				onboardingComplete: true,
			},
			headers,
		});

		return {
			organization: {
				id: organization.id,
				name: organization.name,
				slug: organization.slug,
			},
		};
	});
