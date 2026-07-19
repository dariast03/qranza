import { ORPCError } from "@orpc/server";
import { getBranchById, restoreBranch } from "@repo/database";
import { z } from "zod";

import { organizationProcedure } from "../../../orpc/procedures";

export const restore = organizationProcedure
	.route({
		method: "POST",
		path: "/branches/{id}/restore",
		tags: ["Branches"],
		summary: "Restore branch",
		description: "Restore a soft-deleted branch",
	})
	.input(
		z.object({
			id: z.string(),
		}),
	)
	.handler(async ({ input: { id }, context: { organization } }) => {
		const existing = await getBranchById(id);

		if (!existing || existing.organizationId !== organization.id) {
			throw new ORPCError("NOT_FOUND", {
				message: "Branch not found",
			});
		}

		const branch = await restoreBranch(id);

		if (!branch) {
			throw new ORPCError("INTERNAL_SERVER_ERROR", {
				message: "Failed to restore branch",
			});
		}

		return branch;
	});
