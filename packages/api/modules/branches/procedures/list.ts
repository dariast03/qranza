import { getBranchesByOrganizationId } from "@repo/database";

import { organizationProcedure } from "../../../orpc/procedures";

export const list = organizationProcedure
	.route({
		method: "GET",
		path: "/branches",
		tags: ["Branches"],
		summary: "List branches",
		description: "Get all branches for the active organization",
	})
	.handler(async ({ context: { organization } }) => {
		const branches = await getBranchesByOrganizationId(organization.id);

		return branches.map((b) => ({
			id: b.id,
			organizationId: b.organizationId,
			brandingId: b.brandingId,
			name: b.name,
			slug: b.slug,
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
			timezone: b.timezone,
			currencyCode: b.currencyCode,
			createdAt: b.createdAt,
			updatedAt: b.updatedAt,
		}));
	});
