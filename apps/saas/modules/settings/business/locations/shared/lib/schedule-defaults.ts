import type { DayOfWeek } from "../types/branch";
import { DAYS_OF_WEEK } from "../types/branch";

export const DEFAULT_OPEN_TIME = "09:00";
export const DEFAULT_CLOSE_TIME = "18:00";

/**
 * Days that are open by default when creating a new branch schedule.
 * Sunday is intentionally closed — common opening pattern for retail.
 */
export const DEFAULT_OPEN_DAYS: readonly DayOfWeek[] = [
	"MONDAY",
	"TUESDAY",
	"WEDNESDAY",
	"THURSDAY",
	"FRIDAY",
	"SATURDAY",
] as const;

export interface DayOfWeekMeta {
	value: DayOfWeek;
	short: string;
}

export const DAY_OF_WEEK_META: readonly DayOfWeekMeta[] = [
	{ value: "MONDAY", short: "Mon" },
	{ value: "TUESDAY", short: "Tue" },
	{ value: "WEDNESDAY", short: "Wed" },
	{ value: "THURSDAY", short: "Thu" },
	{ value: "FRIDAY", short: "Fri" },
	{ value: "SATURDAY", short: "Sat" },
	{ value: "SUNDAY", short: "Sun" },
] as const;

export function isDefaultOpenDay(day: DayOfWeek): boolean {
	return DEFAULT_OPEN_DAYS.includes(day);
}

export function buildDefaultWeeklySlots(): {
	dayOfWeek: DayOfWeek;
	opensAt: string;
	closesAt: string;
}[] {
	return DAYS_OF_WEEK.filter(isDefaultOpenDay).map((dayOfWeek) => ({
		dayOfWeek,
		opensAt: DEFAULT_OPEN_TIME,
		closesAt: DEFAULT_CLOSE_TIME,
	}));
}

export function getDayShortLabel(day: DayOfWeek): string {
	return DAY_OF_WEEK_META.find((d) => d.value === day)?.short ?? day;
}
