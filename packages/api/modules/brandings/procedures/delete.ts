import { ORPCError } from "@orpc/server";
import { deleteBranding, getBrandingById } from "@repo/database";
import { z } from "zod";

import { organizationProcedure } from "../../../orpc/procedures";

export const remove = organizationProcedure
	.route({
		method: "DELETE",
		path: "/brandings/{id}",
		tags: ["Brandings"],
		summary: "Delete branding",
		description: "Soft delete a branding",
	})
	.input(
		z.object({
			id: z.string(),
		}),
	)
	.handler(async ({ input: { id }, context: { organization, user } }) => {
		const existing = await getBrandingById(id);

		if (!existing || existing.organizationId !== organization.id) {
			throw new ORPCError("NOT_FOUND", {
				message: "Branding not found",
			});
		}

		await deleteBranding(id, user.id);

		return { success: true };
	});
