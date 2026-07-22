import {
	countBranchesByOrganizationId,
	getBranchesByOrganizationId,
} from "@repo/database";
import { z } from "zod";

import { organizationProcedure } from "../../../orpc/procedures";

export const list = organizationProcedure
	.route({
		method: "GET",
		path: "/branches",
		tags: ["Branches"],
		summary: "List branches",
		description: "Get branches for the active organization with pagination, search, and sorting",
	})
	.input(
		z.object({
			limit: z.number().int().min(1).max(100).default(10),
			offset: z.number().int().min(0).default(0),
			query: z.string().max(100).default(""),
			sort: z
				.object({
					field: z.enum(["name", "type", "status", "city", "createdAt"]).default("name"),
					direction: z.enum(["asc", "desc"]).default("asc"),
				})
				.default({ field: "name", direction: "asc" }),
		}),
	)
	.handler(async ({ input, context: { organization } }) => {
		const { limit, offset, query, sort } = input;

		const [branches, total] = await Promise.all([
			getBranchesByOrganizationId({
				organizationId: organization.id,
				limit,
				offset,
				query: query || undefined,
				sort,
			}),
			countBranchesByOrganizationId(
				organization.id,
				query || undefined,
			),
		]);

		return {
			data: branches.map((b) => ({
				id: b.id,
				organizationId: b.organizationId,
				brandingId: b.brandingId,
				name: b.name,
				type: b.type,
				status: b.status,
				isDefault: b.isDefault,
				address: b.address,
				city: b.city,
				countryCode: b.countryCode,
				latitude: b.latitude,
				longitude: b.longitude,
				phone: b.phone,
				email: b.email,
				website: b.website,
				socialLinks: b.socialLinks,
				createdAt: b.createdAt,
				updatedAt: b.updatedAt,
			})),
			total,
		};
	});
