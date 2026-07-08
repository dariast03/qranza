import { and, eq } from "drizzle-orm";

import { db } from "../client";
import { schedule, scheduleException, scheduleWeeklySlot } from "../schema";

export async function getScheduleBySchedulable(
	schedulableType: "BRANCH",
	schedulableId: string,
) {
	return db.query.schedule.findFirst({
		where: (s, { and, eq }) =>
			and(
				eq(s.schedulableType, schedulableType),
				eq(s.schedulableId, schedulableId),
			),
		with: {
			weeklySlots: true,
			exceptions: true,
		},
	});
}

export async function getScheduleById(id: string) {
	return db.query.schedule.findFirst({
		where: (s, { eq }) => eq(s.id, id),
		with: {
			weeklySlots: true,
			exceptions: true,
		},
	});
}

export async function getScheduleByOrganizationId(organizationId: string) {
	return db.query.schedule.findMany({
		where: (s, { eq }) => eq(s.organizationId, organizationId),
		with: {
			weeklySlots: true,
			exceptions: true,
		},
	});
}

export async function createSchedule({
	organizationId,
	schedulableType,
	schedulableId,
	isEnabled = true,
}: {
	organizationId: string;
	schedulableType: "BRANCH";
	schedulableId: string;
	isEnabled?: boolean;
}) {
	const [{ id }] = await db
		.insert(schedule)
		.values({
			organizationId,
			schedulableType,
			schedulableId,
			isEnabled,
		})
		.returning({ id: schedule.id });

	return getScheduleById(id);
}

export async function updateSchedule(
	id: string,
	data: {
		isEnabled?: boolean;
	},
) {
	await db.update(schedule).set(data).where(eq(schedule.id, id));
	return getScheduleById(id);
}

export async function deleteSchedule(id: string) {
	await db.delete(schedule).where(eq(schedule.id, id));
}

// Weekly Slots

export async function getWeeklySlotsByScheduleId(scheduleId: string) {
	return db.query.scheduleWeeklySlot.findMany({
		where: (slot, { eq }) => eq(slot.scheduleId, scheduleId),
		orderBy: (slot, { asc, asc: ascFn }) => [
			asc(slot.dayOfWeek),
			asc(slot.opensAt),
		],
	});
}

export async function createWeeklySlot({
	scheduleId,
	dayOfWeek,
	opensAt,
	closesAt,
	closesNextDay = false,
}: {
	scheduleId: string;
	dayOfWeek: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
	opensAt: string;
	closesAt: string;
	closesNextDay?: boolean;
}) {
	const [{ id }] = await db
		.insert(scheduleWeeklySlot)
		.values({
			scheduleId,
			dayOfWeek,
			opensAt,
			closesAt,
			closesNextDay,
		})
		.returning({ id: scheduleWeeklySlot.id });

	return db.query.scheduleWeeklySlot.findFirst({
		where: (slot, { eq }) => eq(slot.id, id),
	});
}

export async function updateWeeklySlot(
	id: string,
	data: {
		dayOfWeek?: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
		opensAt?: string;
		closesAt?: string;
		closesNextDay?: boolean;
	},
) {
	await db.update(scheduleWeeklySlot).set(data).where(eq(scheduleWeeklySlot.id, id));
	return db.query.scheduleWeeklySlot.findFirst({
		where: (slot, { eq }) => eq(scheduleWeeklySlot.id, id),
	});
}

export async function deleteWeeklySlot(id: string) {
	await db.delete(scheduleWeeklySlot).where(eq(scheduleWeeklySlot.id, id));
}

export async function deleteWeeklySlotsByScheduleId(scheduleId: string) {
	await db
		.delete(scheduleWeeklySlot)
		.where(eq(scheduleWeeklySlot.scheduleId, scheduleId));
}

// Exceptions

export async function getExceptionsByScheduleId(scheduleId: string) {
	return db.query.scheduleException.findMany({
		where: (exc, { eq }) => eq(exc.scheduleId, scheduleId),
		orderBy: (exc, { asc }) => [asc(exc.date)],
	});
}

export async function getExceptionByDate(scheduleId: string, date: string) {
	return db.query.scheduleException.findFirst({
		where: (exc, { and, eq }) =>
			and(eq(exc.scheduleId, scheduleId), eq(exc.date, date)),
	});
}

export async function createException({
	scheduleId,
	date,
	isClosed = true,
	opensAt,
	closesAt,
	reason,
}: {
	scheduleId: string;
	date: string;
	isClosed?: boolean;
	opensAt?: string | null;
	closesAt?: string | null;
	reason?: string | null;
}) {
	const [{ id }] = await db
		.insert(scheduleException)
		.values({
			scheduleId,
			date,
			isClosed,
			opensAt,
			closesAt,
			reason,
		})
		.returning({ id: scheduleException.id });

	return db.query.scheduleException.findFirst({
		where: (exc, { eq }) => eq(exc.id, id),
	});
}

export async function updateException(
	id: string,
	data: {
		isClosed?: boolean;
		opensAt?: string | null;
		closesAt?: string | null;
		reason?: string | null;
	},
) {
	await db.update(scheduleException).set(data).where(eq(scheduleException.id, id));
	return db.query.scheduleException.findFirst({
		where: (exc, { eq }) => eq(exc.id, id),
	});
}

export async function deleteException(id: string) {
	await db.delete(scheduleException).where(eq(scheduleException.id, id));
}

export async function deleteExceptionsByScheduleId(scheduleId: string) {
	await db
		.delete(scheduleException)
		.where(eq(scheduleException.scheduleId, scheduleId));
}
