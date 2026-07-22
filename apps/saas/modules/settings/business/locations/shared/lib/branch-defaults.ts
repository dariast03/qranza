import type { Branch } from "../types/branch";
import { buildDefaultWeeklySlots } from "./schedule-defaults";
import { sortWeeklySlots, type BranchFormValues } from "./branch-schema";

export function getEmptyBranchFormValues(): BranchFormValues {
	return {
		name: "",
		brandingId: "",
		address: "",
		city: "",
		countryCode: "",
		phone: "",
		email: "",
		website: "",
		weeklySlots: buildDefaultWeeklySlots(),
	};
}

export function branchToFormValues(branch: Branch): BranchFormValues {
	const weeklySlots = branch.schedule?.weeklySlots ?? [];

	return {
		name: branch.name ?? "",
		brandingId: branch.brandingId ?? "",
		address: branch.address ?? "",
		city: branch.city ?? "",
		countryCode: branch.countryCode ?? "",
		phone: branch.phone ?? "",
		email: branch.email ?? "",
		website: branch.website ?? "",
		weeklySlots: sortWeeklySlots(
			weeklySlots.map((slot) => ({
				dayOfWeek: slot.dayOfWeek,
				opensAt: slot.opensAt,
				closesAt: slot.closesAt,
			})),
		),
	};
}

function emptyToNull(value: string | undefined): string | null | undefined {
	if (value === undefined) return undefined;
	if (value.trim() === "") return null;
	return value;
}

export function formValuesToCreateInput(values: BranchFormValues) {
	return {
		name: values.name,
		address: emptyToNull(values.address) ?? undefined,
		city: emptyToNull(values.city) ?? undefined,
		countryCode: emptyToNull(values.countryCode) ?? undefined,
		phone: emptyToNull(values.phone) ?? undefined,
		email: emptyToNull(values.email) ?? undefined,
		website: emptyToNull(values.website) ?? undefined,
		schedule: {
			weeklySlots: sortWeeklySlots(values.weeklySlots),
		},
	};
}

export function formValuesToUpdateInput(values: BranchFormValues) {
	return {
		name: values.name,
		address: emptyToNull(values.address),
		city: emptyToNull(values.city),
		countryCode: emptyToNull(values.countryCode),
		phone: emptyToNull(values.phone),
		email: emptyToNull(values.email),
		website: emptyToNull(values.website),
		schedule: {
			weeklySlots: sortWeeklySlots(values.weeklySlots),
		},
	};
}
