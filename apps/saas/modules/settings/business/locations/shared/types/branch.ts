export const DAYS_OF_WEEK = [
	"MONDAY",
	"TUESDAY",
	"WEDNESDAY",
	"THURSDAY",
	"FRIDAY",
	"SATURDAY",
	"SUNDAY",
] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export interface BranchScheduleSlot {
	id?: string;
	dayOfWeek: DayOfWeek;
	opensAt: string;
	closesAt: string;
	closesNextDay?: boolean;
}

export interface BranchSchedule {
	id?: string;
	weeklySlots: BranchScheduleSlot[];
}

export interface Branch {
	id: string;
	name: string;
	type: "PHYSICAL" | "VIRTUAL";
	status: "ACTIVE" | "ARCHIVED";
	isDefault: boolean;
	brandingId: string | null;
	address: string | null;
	city: string | null;
	countryCode: string | null;
	phone: string | null;
	email: string | null;
	website: string | null;
	createdAt: Date | string;
	updatedAt: Date | string;
	schedule?: BranchSchedule | null;
}

export interface BrandingOption {
	id: string;
	name: string;
	logoUrl: string | null;
	primaryColor: string | null;
}
