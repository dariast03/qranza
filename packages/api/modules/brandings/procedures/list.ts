import { getBrandingsByOrganizationId } from "@repo/database";

import { organizationProcedure } from "../../../orpc/procedures";

export const list = organizationProcedure
	.route({
		method: "GET",
		path: "/brandings",
		tags: ["Brandings"],
		summary: "List brandings",
		description: "Get all brandings for the active organization",
	})
	.handler(async ({ context: { organization } }) => {
		const brandings = await getBrandingsByOrganizationId(organization.id);

		return brandings.map((b) => ({
			id: b.id,
			organizationId: b.organizationId,
			name: b.name,
			logoUrl: b.logoUrl,
			primaryColor: b.primaryColor,
			createdAt: b.createdAt,
			updatedAt: b.updatedAt,
		}));
	});
