import { ORPCError } from "@orpc/server";
import { deleteBranch, getBranchById } from "@repo/database";
import { z } from "zod";

import { organizationProcedure } from "../../../orpc/procedures";

export const remove = organizationProcedure
	.route({
		method: "DELETE",
		path: "/branches/{id}",
		tags: ["Branches"],
		summary: "Delete branch",
		description: "Soft delete a branch",
	})
	.input(
		z.object({
			id: z.string(),
		}),
	)
	.handler(async ({ input: { id }, context: { organization, user } }) => {
		const existing = await getBranchById(id);

		if (!existing || existing.organizationId !== organization.id) {
			throw new ORPCError("NOT_FOUND", {
				message: "Branch not found",
			});
		}

		await deleteBranch(id, user.id);

		return { success: true };
	});
