import { ORPCError } from "@orpc/server";
import {
	createWeeklySlot,
	deleteWeeklySlot,
	getScheduleById,
	getWeeklySlotsByScheduleId,
	updateWeeklySlot,
} from "@repo/database";
import { z } from "zod";

import { organizationProcedure } from "../../../orpc/procedures";

const dayOfWeekEnum = z.enum([
	"MONDAY",
	"TUESDAY",
	"WEDNESDAY",
	"THURSDAY",
	"FRIDAY",
	"SATURDAY",
	"SUNDAY",
]);

const slotSchema = z.object({
	id: z.string().optional(),
	dayOfWeek: dayOfWeekEnum,
	opensAt: z.string(),
	closesAt: z.string(),
	closesNextDay: z.boolean().optional(),
});

function validateNoOverlaps(slots: z.infer<typeof slotSchema>[]) {
	const byDay = new Map<string, z.infer<typeof slotSchema>[]>();

	for (const slot of slots) {
		const existing = byDay.get(slot.dayOfWeek) ?? [];
		existing.push(slot);
		byDay.set(slot.dayOfWeek, existing);
	}

	for (const [day, daySlots] of byDay) {
		for (let i = 0; i < daySlots.length; i++) {
			for (let j = i + 1; j < daySlots.length; j++) {
				const a = daySlots[i];
				const b = daySlots[j];
				const aOpens = a.opensAt;
				const aCloses = a.closesNextDay ? "24:00" : a.closesAt;
				const bOpens = b.opensAt;
				const bCloses = b.closesNextDay ? "24:00" : b.closesAt;

				const overlaps = aOpens < bCloses && bOpens < aCloses;

				if (overlaps) {
					throw new ORPCError("BAD_REQUEST", {
						message: `Overlapping slots on ${day}: [${a.opensAt}-${a.closesAt}] and [${b.opensAt}-${b.closesAt}]`,
					});
				}
			}
		}
	}
}

export const upsertSlots = organizationProcedure
	.route({
		method: "PUT",
		path: "/schedules/{id}/slots",
		tags: ["Schedules"],
		summary: "Upsert weekly slots",
		description: "Merge weekly slots: add new, update existing, remove missing",
	})
	.input(
		z.object({
			id: z.string(),
			slots: z.array(slotSchema),
		}),
	)
	.handler(async ({ input: { id, slots }, context: { organization } }) => {
		const schedule = await getScheduleById(id);

		if (!schedule || schedule.organizationId !== organization.id) {
			throw new ORPCError("NOT_FOUND", {
				message: "Schedule not found",
			});
		}

		validateNoOverlaps(slots);

		const existingSlots = await getWeeklySlotsByScheduleId(id);
		const existingMap = new Map(existingSlots.map((s) => [s.id, s]));

		const incomingIds = new Set(slots.filter((s) => s.id).map((s) => s.id!));

		const toDelete = existingSlots.filter((s) => !incomingIds.has(s.id));

		for (const slot of toDelete) {
			await deleteWeeklySlot(slot.id);
		}

		const results = [];
		for (const slot of slots) {
			if (slot.id && existingMap.has(slot.id)) {
				const updated = await updateWeeklySlot(slot.id, {
					dayOfWeek: slot.dayOfWeek,
					opensAt: slot.opensAt,
					closesAt: slot.closesAt,
					closesNextDay: slot.closesNextDay,
				});
				results.push(updated);
			} else {
				const created = await createWeeklySlot({
					scheduleId: id,
					dayOfWeek: slot.dayOfWeek,
					opensAt: slot.opensAt,
					closesAt: slot.closesAt,
					closesNextDay: slot.closesNextDay,
				});
				results.push(created);
			}
		}

		return results;
	});
