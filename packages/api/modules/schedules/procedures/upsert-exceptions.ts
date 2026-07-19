import { ORPCError } from "@orpc/server";
import {
	createException,
	deleteException,
	getExceptionsByScheduleId,
	getScheduleById,
	updateException,
} from "@repo/database";
import { z } from "zod";

import { organizationProcedure } from "../../../orpc/procedures";

const exceptionSchema = z.object({
	id: z.string().optional(),
	date: z.string(),
	isClosed: z.boolean().optional(),
	opensAt: z.string().nullable().optional(),
	closesAt: z.string().nullable().optional(),
	reason: z.string().nullable().optional(),
});

export const upsertExceptions = organizationProcedure
	.route({
		method: "PUT",
		path: "/schedules/{id}/exceptions",
		tags: ["Schedules"],
		summary: "Upsert exceptions",
		description: "Merge exceptions: add new, update existing, remove missing",
	})
	.input(
		z.object({
			id: z.string(),
			exceptions: z.array(exceptionSchema),
		}),
	)
	.handler(async ({ input: { id, exceptions }, context: { organization } }) => {
		const schedule = await getScheduleById(id);

		if (!schedule || schedule.organizationId !== organization.id) {
			throw new ORPCError("NOT_FOUND", {
				message: "Schedule not found",
			});
		}

		const existingExceptions = await getExceptionsByScheduleId(id);
		const existingByDate = new Map(existingExceptions.map((e) => [e.date, e]));

		const incomingDates = new Set(exceptions.map((e) => e.date));

		const toDelete = existingExceptions.filter(
			(e) => !incomingDates.has(e.date),
		);

		for (const exc of toDelete) {
			await deleteException(exc.id);
		}

		const results = [];
		for (const exc of exceptions) {
			const existing = existingByDate.get(exc.date);

			if (existing) {
				const updated = await updateException(existing.id, {
					isClosed: exc.isClosed,
					opensAt: exc.opensAt,
					closesAt: exc.closesAt,
					reason: exc.reason,
				});
				results.push(updated);
			} else {
				const created = await createException({
					scheduleId: id,
					date: exc.date,
					isClosed: exc.isClosed,
					opensAt: exc.opensAt,
					closesAt: exc.closesAt,
					reason: exc.reason,
				});
				results.push(created);
			}
		}

		return results;
	});
