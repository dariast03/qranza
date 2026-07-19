import { ORPCError } from "@orpc/server";
import { getBrandingById } from "@repo/database";
import { z } from "zod";

import { organizationProcedure } from "../../../orpc/procedures";

export const get = organizationProcedure
	.route({
		method: "GET",
		path: "/brandings/{id}",
		tags: ["Brandings"],
		summary: "Get branding",
		description: "Get a branding by ID with relations",
	})
	.input(
		z.object({
			id: z.string(),
		}),
	)
	.handler(async ({ input: { id }, context: { organization } }) => {
		const branding = await getBrandingById(id);

		if (!branding || branding.organizationId !== organization.id) {
			throw new ORPCError("NOT_FOUND", {
				message: "Branding not found",
			});
		}

		return branding;
	});
