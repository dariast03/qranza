import { ORPCError } from "@orpc/server";
import { createBranding } from "@repo/database";
import { z } from "zod";

import { organizationProcedure } from "../../../orpc/procedures";

export const create = organizationProcedure
	.route({
		method: "POST",
		path: "/brandings",
		tags: ["Brandings"],
		summary: "Create branding",
		description: "Create a new branding for the active organization",
	})
	.input(
		z.object({
			name: z.string().min(1).max(100),
			logoUrl: z.string().nullable().optional(),
			primaryColor: z.string().nullable().optional(),
		}),
	)
	.handler(async ({ input, context: { organization } }) => {
		const branding = await createBranding({
			...input,
			organizationId: organization.id,
		});

		if (!branding) {
			throw new ORPCError("INTERNAL_SERVER_ERROR", {
				message: "Failed to create branding",
			});
		}

		return branding;
	});
