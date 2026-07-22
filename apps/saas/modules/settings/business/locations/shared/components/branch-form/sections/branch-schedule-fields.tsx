import { useTranslations } from "@i18n/intl";
import { Button } from "@repo/ui/components/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "@repo/ui/components/field";
import { Input } from "@repo/ui/components/input";
import { Switch } from "@repo/ui/components/switch";
import { PlusIcon, Trash2Icon } from "lucide-react";

import { DAYS_OF_WEEK } from "../../../types/branch";
import type { DayOfWeek } from "../../../types/branch";
import {
	DEFAULT_CLOSE_TIME,
	DEFAULT_OPEN_TIME,
} from "../../../lib/schedule-defaults";
import {
	type BranchFormProps,
	type BranchFormSlot,
} from "../../../lib/branch-schema";
import { useStore } from "@tanstack/react-store";
import { useMemo, useCallback } from "react";

interface DisplaySlot extends BranchFormSlot {
	_placeholder?: boolean;
}

interface BranchScheduleFieldsProps {
	form: BranchFormProps;
}

export function BranchScheduleFields({ form }: BranchScheduleFieldsProps) {
	const t = useTranslations("settings.branches.form.schedule");

	return (
		<FieldSet className="gap-4">
			<div>
				<FieldLegend variant="label">{t("title")}</FieldLegend>
				<FieldDescription>{t("description")}</FieldDescription>
			</div>

			<form.Field
				name="weeklySlots"
				children={(field) => {
					const isInvalid =
						field.state.meta.isTouched && !field.state.meta.isValid;

					return (
						<FieldGroup className="gap-3">
							{DAYS_OF_WEEK.map((day) => (
								<DaySchedule key={day} day={day} form={form} />
							))}

							{isInvalid && (
								<FieldError errors={field.state.meta.errors} />
							)}
						</FieldGroup>
					);
				}}
			/>
		</FieldSet>
	);
}

interface DayScheduleProps {
	day: DayOfWeek;
	form: BranchFormProps;
}

function DaySchedule({ day, form }: DayScheduleProps) {
	const t = useTranslations("settings.branches.form.schedule");

	const allSlots = useStore(form.store, (state) => state.values.weeklySlots);

	const daySlots = useMemo(
		() =>
			allSlots
				.filter((slot) => slot.dayOfWeek === day)
				.sort((a, b) => a.opensAt.localeCompare(b.opensAt)),
		[allSlots, day],
	);

	const dayLabel = t(`days.${day}`);
	const isDayOpen = daySlots.length > 0;

	const getDefaultSlot = useCallback(
		() => ({
			dayOfWeek: day,
			opensAt: DEFAULT_OPEN_TIME,
			closesAt: DEFAULT_CLOSE_TIME,
		}),
		[day],
	);

	const addSlot = useCallback(() => {
		const current = form.getFieldValue("weeklySlots");
		const existingDaySlots = current.filter((s) => s.dayOfWeek === day);

		let opensAt = DEFAULT_OPEN_TIME;
		let closesAt = DEFAULT_CLOSE_TIME;

		if (existingDaySlots.length > 0) {
			const sorted = [...existingDaySlots].sort((a, b) =>
				a.opensAt.localeCompare(b.opensAt),
			);
			const lastSlot = sorted[sorted.length - 1];
			if (lastSlot) {
				opensAt = lastSlot.closesAt;
				closesAt = addMinutes(lastSlot.closesAt, 120);
			}
		}

		form.setFieldValue("weeklySlots", [
			...current,
			{ dayOfWeek: day, opensAt, closesAt },
		]);
	}, [form, day]);

	const removeSlot = useCallback(
		(index: number) => {
			const current = form.getFieldValue("weeklySlots");
			const daySlotIndices = current
				.map((s, i) => (s.dayOfWeek === day ? i : -1))
				.filter((i) => i !== -1);

			const targetIndex = daySlotIndices[index];
			if (targetIndex === undefined) return;

			form.setFieldValue(
				"weeklySlots",
				current.filter((_, i) => i !== targetIndex),
			);
		},
		[form, day],
	);

	const updateSlot = useCallback(
		(index: number, key: keyof BranchFormSlot, value: string) => {
			const current = form.getFieldValue("weeklySlots");
			const daySlotIndices = current
				.map((s, i) => (s.dayOfWeek === day ? i : -1))
				.filter((i) => i !== -1);

			const targetIndex = daySlotIndices[index];
			if (targetIndex === undefined) return;

			form.setFieldValue(
				"weeklySlots",
				current.map((s, i) =>
					i === targetIndex ? { ...s, [key]: value } : s,
				),
			);
		},
		[form, day],
	);

	// Handle focus on closed day - enable the day and focus the input
	const handleFocusClosed = useCallback(() => {
		if (!isDayOpen) {
			const current = form.getFieldValue("weeklySlots");
			const newSlot = {
				dayOfWeek: day,
				opensAt: DEFAULT_OPEN_TIME,
				closesAt: DEFAULT_CLOSE_TIME,
			};
			form.setFieldValue("weeklySlots", [...current, newSlot]);
		}
	}, [form, isDayOpen, day]);

	const slotsToShow: DisplaySlot[] =
		daySlots.length > 0
			? daySlots
			: [{ ...getDefaultSlot(), _placeholder: true }];

	return (
		<Field className="gap-3">
			<div className="flex items-start gap-4">
				<div className="flex items-center gap-3 w-36 shrink-0 pt-2">
					<Switch
						checked={isDayOpen}
						onCheckedChange={(value) => {
							const current = form.getFieldValue("weeklySlots");

							if (value) {
								form.setFieldValue("weeklySlots", [
									...current,
									{
										dayOfWeek: day,
										opensAt: DEFAULT_OPEN_TIME,
										closesAt: DEFAULT_CLOSE_TIME,
									},
								]);
							} else {
								form.setFieldValue(
									"weeklySlots",
									current.filter((s) => s.dayOfWeek !== day),
								);
							}
						}}
					/>

					<FieldLabel>{dayLabel}</FieldLabel>
				</div>

				<div className="flex flex-col gap-2">
					{isDayOpen ? (
						<>
							{daySlots.map((slot, index) => (
								<div
									key={index}
									className="flex items-center gap-2"
								>
									<Input
										type="time"
										value={slot.opensAt}
										onChange={(e) =>
											updateSlot(
												index,
												"opensAt",
												e.target.value,
											)
										}
										className="w-32 h-10"
									/>

									<span className="text-muted-foreground">
										-
									</span>

									<Input
										type="time"
										value={slot.closesAt}
										onChange={(e) =>
											updateSlot(
												index,
												"closesAt",
												e.target.value,
											)
										}
										className="w-32"
									/>

									<Button
										type="button"
										variant="ghost"
										size="icon-sm"
										onClick={() => removeSlot(index)}
									>
										<Trash2Icon />
									</Button>
								</div>
							))}

							<Button
								type="button"
								variant="link"
								size="sm"
								onClick={addSlot}
								className="w-fit justify-start px-0"
							>
								<PlusIcon className="size-4" />
								{t("addSlot")}
							</Button>
						</>
					) : (
						<>
							<button
								type="button"
								onClick={() => {
									const current =
										form.getFieldValue("weeklySlots");

									form.setFieldValue("weeklySlots", [
										...current,
										{
											dayOfWeek: day,
											opensAt: DEFAULT_OPEN_TIME,
											closesAt: DEFAULT_CLOSE_TIME,
										},
									]);
								}}
								className="
										flex h-10 w-32 items-center
										rounded-md border px-3
										text-sm text-muted-foreground
									"
							>
								{t("closed")}
							</button>

							<Button
								type="button"
								variant="link"
								size="sm"
								disabled
								className="w-fit justify-start px-0"
							>
								<PlusIcon className="size-4" />
								{t("addSlot")}
							</Button>
						</>
					)}
				</div>
			</div>
		</Field>
	);
}

function addMinutes(time: string, minutes: number): string {
	const [h, m] = time.split(":").map(Number);
	if (h === undefined || m === undefined) return time;
	const total = h * 60 + m + minutes;
	const newH = Math.floor((total / 60) % 24);
	const newM = total % 60;
	return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
}
