import { ORPCError } from "@orpc/server";
import { getBrandingById, updateBranding } from "@repo/database";
import { z } from "zod";

import { organizationProcedure } from "../../../orpc/procedures";

export const update = organizationProcedure
	.route({
		method: "PATCH",
		path: "/brandings/{id}",
		tags: ["Brandings"],
		summary: "Update branding",
		description: "Update an existing branding",
	})
	.input(
		z.object({
			id: z.string(),
			name: z.string().min(1).max(100).optional(),
			logoUrl: z.string().nullable().optional(),
			primaryColor: z.string().nullable().optional(),
		}),
	)
	.handler(async ({ input: { id, ...data }, context: { organization } }) => {
		const existing = await getBrandingById(id);

		if (!existing || existing.organizationId !== organization.id) {
			throw new ORPCError("NOT_FOUND", {
				message: "Branding not found",
			});
		}

		const branding = await updateBranding(id, data);

		if (!branding) {
			throw new ORPCError("INTERNAL_SERVER_ERROR", {
				message: "Failed to update branding",
			});
		}

		return branding;
	});
