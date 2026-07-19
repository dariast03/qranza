import { ORPCError } from "@orpc/server";
import { deleteSchedule, getScheduleById } from "@repo/database";
import { z } from "zod";

import { organizationProcedure } from "../../../orpc/procedures";

export const remove = organizationProcedure
	.route({
		method: "DELETE",
		path: "/schedules/{id}",
		tags: ["Schedules"],
		summary: "Delete schedule",
		description: "Delete a schedule and its slots/exceptions",
	})
	.input(
		z.object({
			id: z.string(),
		}),
	)
	.handler(async ({ input: { id }, context: { organization } }) => {
		const existing = await getScheduleById(id);

		if (!existing || existing.organizationId !== organization.id) {
			throw new ORPCError("NOT_FOUND", {
				message: "Schedule not found",
			});
		}

		await deleteSchedule(id);

		return { success: true };
	});
