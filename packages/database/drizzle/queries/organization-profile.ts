import { eq } from "drizzle-orm";

import { db } from "../client";
import { organizationProfile } from "../schema";

export async function getProfileByOrganizationId(organizationId: string) {
	return db.query.organizationProfile.findFirst({
		where: (p, { eq }) => eq(p.organizationId, organizationId),
		with: {
			country: true,
			currency: true,
			industry: true,
		},
	});
}

export async function getProfileById(id: string) {
	return db.query.organizationProfile.findFirst({
		where: (p, { eq }) => eq(p.id, id),
		with: {
			organization: true,
			country: true,
			currency: true,
			industry: true,
		},
	});
}

export async function createOrganizationProfile({
	organizationId,
	industryCode,
	countryCode,
	currencyCode,
	timezone,
	city,
	address,
}: {
	organizationId: string;
	industryCode: string;
	countryCode: string;
	currencyCode: string;
	timezone: string;
	city?: string | null;
	address?: string | null;
}) {
	const [{ id }] = await db
		.insert(organizationProfile)
		.values({
			organizationId,
			industryCode,
			countryCode,
			currencyCode,
			timezone,
			city,
			address,
		})
		.returning({ id: organizationProfile.id });

	return getProfileById(id);
}

export async function updateOrganizationProfile(
	organizationId: string,
	data: {
		industryCode?: string;
		countryCode?: string;
		currencyCode?: string;
		timezone?: string;
		city?: string | null;
		address?: string | null;
	},
) {
	await db
		.update(organizationProfile)
		.set(data)
		.where(eq(organizationProfile.organizationId, organizationId));

	return getProfileByOrganizationId(organizationId);
}
