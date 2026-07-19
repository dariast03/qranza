import { ORPCError } from "@orpc/server";
import { getScheduleById, getWeeklySlotsByScheduleId } from "@repo/database";
import { z } from "zod";

import { organizationProcedure } from "../../../orpc/procedures";

export const listSlots = organizationProcedure
	.route({
		method: "GET",
		path: "/schedules/{id}/slots",
		tags: ["Schedules"],
		summary: "List weekly slots",
		description: "Get all weekly slots for a schedule",
	})
	.input(
		z.object({
			id: z.string(),
		}),
	)
	.handler(async ({ input: { id }, context: { organization } }) => {
		const schedule = await getScheduleById(id);

		if (!schedule || schedule.organizationId !== organization.id) {
			throw new ORPCError("NOT_FOUND", {
				message: "Schedule not found",
			});
		}

		return getWeeklySlotsByScheduleId(id);
	});
