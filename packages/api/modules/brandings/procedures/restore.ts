import { ORPCError } from "@orpc/server";
import { getBrandingById, restoreBranding } from "@repo/database";
import { z } from "zod";

import { organizationProcedure } from "../../../orpc/procedures";

export const restore = organizationProcedure
	.route({
		method: "POST",
		path: "/brandings/{id}/restore",
		tags: ["Brandings"],
		summary: "Restore branding",
		description: "Restore a soft-deleted branding",
	})
	.input(
		z.object({
			id: z.string(),
		}),
	)
	.handler(async ({ input: { id }, context: { organization } }) => {
		const existing = await getBrandingById(id);

		if (!existing || existing.organizationId !== organization.id) {
			throw new ORPCError("NOT_FOUND", {
				message: "Branding not found",
			});
		}

		const branding = await restoreBranding(id);

		if (!branding) {
			throw new ORPCError("INTERNAL_SERVER_ERROR", {
				message: "Failed to restore branding",
			});
		}

		return branding;
	});
