import { ORPCError } from "@orpc/server";
import { getBranchById } from "@repo/database";
import { z } from "zod";

import { organizationProcedure } from "../../../orpc/procedures";

export const get = organizationProcedure
	.route({
		method: "GET",
		path: "/branches/{id}",
		tags: ["Branches"],
		summary: "Get branch",
		description: "Get a branch by ID with relations",
	})
	.input(
		z.object({
			id: z.string(),
		}),
	)
	.handler(async ({ input: { id }, context: { organization } }) => {
		const branch = await getBranchById(id);

		if (!branch || branch.organizationId !== organization.id) {
			throw new ORPCError("NOT_FOUND", {
				message: "Branch not found",
			});
		}

		return branch;
	});
