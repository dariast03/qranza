import { createId as cuid } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
	boolean,
	date,
	index,
	pgEnum,
	pgTable,
	text,
	time,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";

import { organization } from "./organizations";

export const scheduleSchedulableTypeEnum = pgEnum("ScheduleSchedulableType", [
	"BRANCH",
]);

export const dayOfWeekEnum = pgEnum("DayOfWeek", [
	"MONDAY",
	"TUESDAY",
	"WEDNESDAY",
	"THURSDAY",
	"FRIDAY",
	"SATURDAY",
	"SUNDAY",
]);

/* ---- 1. Cabecera: una fila por schedulable ---- */

export const schedule = pgTable(
	"schedule",
	{
		id: text("id")
			.$defaultFn(() => cuid())
			.primaryKey(),
		organizationId: text("organizationId")
			.notNull()
			.references(() => organization.id, { onDelete: "cascade" }),
		schedulableType: scheduleSchedulableTypeEnum("schedulableType").notNull(),
		schedulableId: text("schedulableId").notNull(),
		isEnabled: boolean("isEnabled").default(true).notNull(),
		createdAt: timestamp("createdAt").defaultNow().notNull(),
		updatedAt: timestamp("updatedAt")
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [
		uniqueIndex("schedule_schedulable_uidx").on(table.schedulableType, table.schedulableId),
		index("schedule_organizationId_idx").on(table.organizationId),
	],
);

/* ---- 2. Horario semanal recurrente: N filas por día = N turnos por día ---- */

export const scheduleWeeklySlot = pgTable(
	"schedule_weekly_slot",
	{
		id: text("id")
			.$defaultFn(() => cuid())
			.primaryKey(),
		scheduleId: text("scheduleId")
			.notNull()
			.references(() => schedule.id, { onDelete: "cascade" }),
		dayOfWeek: dayOfWeekEnum("dayOfWeek").notNull(),
		opensAt: time("opensAt").notNull(),
		closesAt: time("closesAt").notNull(),
		closesNextDay: boolean("closesNextDay").default(false).notNull(),
	},
	(table) => [
		index("schedule_weekly_slot_scheduleId_idx").on(table.scheduleId),
		index("schedule_weekly_slot_day_idx").on(table.scheduleId, table.dayOfWeek),
	],
);

/* ---- 3. Excepciones por fecha: feriados, cierres o horarios especiales ---- */

export const scheduleException = pgTable(
	"schedule_exception",
	{
		id: text("id")
			.$defaultFn(() => cuid())
			.primaryKey(),
		scheduleId: text("scheduleId")
			.notNull()
			.references(() => schedule.id, { onDelete: "cascade" }),
		date: date("date").notNull(),
		isClosed: boolean("isClosed").default(true).notNull(),
		opensAt: time("opensAt"),
		closesAt: time("closesAt"),
		reason: text("reason"),
	},
	(table) => [uniqueIndex("schedule_exception_date_uidx").on(table.scheduleId, table.date)],
);

/* ============================================================================
 * RELATIONS
 * ============================================================================ */

export const scheduleRelations = relations(schedule, ({ one, many }) => ({
	organization: one(organization, {
		fields: [schedule.organizationId],
		references: [organization.id],
	}),
	weeklySlots: many(scheduleWeeklySlot),
	exceptions: many(scheduleException),
}));

export const scheduleWeeklySlotRelations = relations(scheduleWeeklySlot, ({ one }) => ({
	schedule: one(schedule, {
		fields: [scheduleWeeklySlot.scheduleId],
		references: [schedule.id],
	}),
}));

export const scheduleExceptionRelations = relations(scheduleException, ({ one }) => ({
	schedule: one(schedule, {
		fields: [scheduleException.scheduleId],
		references: [schedule.id],
	}),
}));
