import { ORPCError } from "@orpc/server";
import { getScheduleById } from "@repo/database";
import { z } from "zod";

import { organizationProcedure } from "../../../orpc/procedures";

export const get = organizationProcedure
	.route({
		method: "GET",
		path: "/schedules/{id}",
		tags: ["Schedules"],
		summary: "Get schedule",
		description: "Get a schedule by ID with weekly slots and exceptions",
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

		return schedule;
	});
