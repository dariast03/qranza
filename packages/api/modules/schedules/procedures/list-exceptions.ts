import { ORPCError } from "@orpc/server";
import {
	getExceptionsByScheduleId,
	getScheduleById,
} from "@repo/database";
import { z } from "zod";

import { organizationProcedure } from "../../../orpc/procedures";

export const listExceptions = organizationProcedure
	.route({
		method: "GET",
		path: "/schedules/{id}/exceptions",
		tags: ["Schedules"],
		summary: "List exceptions",
		description: "Get all exceptions for a schedule",
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

		return getExceptionsByScheduleId(id);
	});
