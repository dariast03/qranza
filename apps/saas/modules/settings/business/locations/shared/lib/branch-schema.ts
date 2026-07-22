import { z } from "zod";
import type { ReactFormExtendedApi } from "@tanstack/react-form";

import { DAYS_OF_WEEK } from "../types/branch";
import type { DayOfWeek } from "../types/branch";

const dayOfWeekEnum = z.enum(DAYS_OF_WEEK);

const timeString = z
	.string()
	.regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time format");

export const weeklySlotSchema = z.object({
	dayOfWeek: dayOfWeekEnum,
	opensAt: timeString,
	closesAt: timeString,
});

export type BranchFormSlot = z.input<typeof weeklySlotSchema>;

/**
 * A weekly slot is valid when closesAt is strictly after opensAt.
 */
function isSlotValid(slot: BranchFormSlot): boolean {
	return slot.opensAt < slot.closesAt;
}

/**
 * Group slots by day and return a sorted copy. Stable ordering ensures the
 * rendered list never shows an afternoon slot before its morning counterpart.
 */
export function sortWeeklySlots(
	slots: readonly BranchFormSlot[],
): BranchFormSlot[] {
	return [...slots].sort((a, b) => {
		if (a.dayOfWeek !== b.dayOfWeek) {
			return a.dayOfWeek.localeCompare(b.dayOfWeek);
		}
		return a.opensAt.localeCompare(b.opensAt);
	});
}

/**
 * Validate a list of weekly slots:
 *  - every slot must have closesAt > opensAt
 *  - slots on the same day must not overlap
 */
export function validateWeeklySlots(
	slots: readonly BranchFormSlot[],
): string | undefined {
	const byDay = new Map<DayOfWeek, BranchFormSlot[]>();
	for (const slot of slots) {
		const list = byDay.get(slot.dayOfWeek) ?? [];
		list.push(slot);
		byDay.set(slot.dayOfWeek, list);
	}

	for (const [day, daySlots] of byDay) {
		if (daySlots.some((slot) => !isSlotValid(slot))) {
			return `On ${day} the closing time must be after the opening time.`;
		}

		const sorted = [...daySlots].sort((a, b) =>
			a.opensAt.localeCompare(b.opensAt),
		);
		for (let i = 1; i < sorted.length; i++) {
			const prev = sorted[i - 1];
			const curr = sorted[i];
			if (prev && curr && curr.opensAt < prev.closesAt) {
				return `Time slots on ${day} overlap (${prev.opensAt}–${prev.closesAt} and ${curr.opensAt}–${curr.closesAt}).`;
			}
		}
	}

	return undefined;
}

export const branchFormSchema = z.object({
	name: z.string().min(1, "Name is required").max(100),
	// brandingId is kept on the form values for the disabled branding
	// component to bind against, but it is never sent in the API payload.
	brandingId: z.string().optional(),
	address: z.string().optional(),
	city: z.string().optional(),
	countryCode: z
		.string()
		.max(2)
		.optional()
		.transform((value) => (value ? value.toUpperCase() : value)),
	phone: z.string().optional(),
	email: z.union([z.literal(""), z.email()]).optional(),
	website: z
		.union([z.literal(""), z.string().url("Website must be a valid URL")])
		.optional(),
	weeklySlots: z
		.array(weeklySlotSchema)
		.superRefine((slots, ctx) => {
			const error = validateWeeklySlots(slots);
			if (error) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: error,
				});
			}
		}),
});

export type BranchFormValues = z.input<typeof branchFormSchema>;

export type BranchFormProps = ReactFormExtendedApi<
	BranchFormValues,
	any,
	any,
	any,
	any,
	any,
	any,
	any,
	any,
	any,
	any,
	any
>;
