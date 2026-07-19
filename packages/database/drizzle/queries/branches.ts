import { and, eq } from "drizzle-orm";
import { betterClient, db } from "../client";
import * as schema from "../schema";

export async function getBranchesByOrganizationId(organizationId: string) {
	return betterClient.branch.findMany({
		where: { organizationId },
		orderBy: [{ isDefault: "asc" }, { name: "asc" }],
	});
}

export async function getBranchById(id: string) {
	const branchData = await betterClient.branch.findUnique({
		where: { id },
		include: {
			organization: true,
			country: true,
			currency: true,
			branding: true,
		},
	});

	if (!branchData) return null;

	const scheduleData = await db.query.schedule.findFirst({
		where: (s, { and, eq }) =>
			and(eq(s.schedulableType, "BRANCH"), eq(s.schedulableId, id)),
		with: {
			weeklySlots: true,
			exceptions: true,
		},
	});

	return { ...branchData, schedule: scheduleData ?? null };
}

export async function getDefaultBranchByOrganizationId(organizationId: string) {
	return betterClient.branch.findFirst({
		where: { organizationId, isDefault: true },
	});
}

export async function getBranchBySlug(organizationId: string, slug: string) {
	return betterClient.branch.findFirst({
		where: { organizationId, slug },
	});
}

type DayOfWeek = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";

type WeeklySlotInput = {
	dayOfWeek: DayOfWeek;
	opensAt: string;
	closesAt: string;
	closesNextDay?: boolean;
};

type ExceptionInput = {
	date: string;
	isClosed?: boolean;
	opensAt?: string | null;
	closesAt?: string | null;
	reason?: string | null;
};

export async function createBranch({
	organizationId,
	name,
	slug,
	type = "PHYSICAL",
	status = "ACTIVE",
	isDefault = false,
	address,
	city,
	countryCode,
	phone,
	email,
	website,
	socialLinks,
	timezone,
	currencyCode,
	brandingId,
	schedule,
}: {
	organizationId: string;
	name: string;
	slug: string;
	type?: "PHYSICAL" | "VIRTUAL";
	status?: "ACTIVE" | "ARCHIVED";
	isDefault?: boolean;
	address?: string | null;
	city?: string | null;
	countryCode?: string | null;
	phone?: string | null;
	email?: string | null;
	website?: string | null;
	socialLinks?: Record<string, string>;
	timezone?: string | null;
	currencyCode?: string | null;
	brandingId?: string | null;
	schedule?: {
		weeklySlots?: WeeklySlotInput[];
		exceptions?: ExceptionInput[];
	};
}) {
	return db.transaction(async (tx) => {
		const [{ id: branchId }] = await tx
			.insert(schema.branch)
			.values({
				organizationId,
				brandingId: brandingId ?? null,
				name,
				slug,
				type,
				status,
				isDefault,
				address: address ?? null,
				city: city ?? null,
				countryCode: countryCode ?? null,
				phone: phone ?? null,
				email: email ?? null,
				website: website ?? null,
				socialLinks: socialLinks ?? {},
				timezone: timezone ?? null,
				currencyCode: currencyCode ?? null,
			})
			.returning({ id: schema.branch.id });

		const [{ id: scheduleId }] = await tx
			.insert(schema.schedule)
			.values({
				organizationId,
				schedulableType: "BRANCH",
				schedulableId: branchId,
			})
			.returning({ id: schema.schedule.id });

		if (schedule?.weeklySlots?.length) {
			await tx.insert(schema.scheduleWeeklySlot).values(
				schedule.weeklySlots.map((slot) => ({
					scheduleId,
					dayOfWeek: slot.dayOfWeek,
					opensAt: slot.opensAt,
					closesAt: slot.closesAt,
					closesNextDay: slot.closesNextDay ?? false,
				})),
			);
		}

		if (schedule?.exceptions?.length) {
			await tx.insert(schema.scheduleException).values(
				schedule.exceptions.map((exc) => ({
					scheduleId,
					date: exc.date,
					isClosed: exc.isClosed ?? true,
					opensAt: exc.opensAt ?? null,
					closesAt: exc.closesAt ?? null,
					reason: exc.reason ?? null,
				})),
			);
		}

		return getBranchById(branchId);
	});
}

export async function updateBranch(
	id: string,
	data: {
		name?: string;
		slug?: string;
		type?: "PHYSICAL" | "VIRTUAL";
		status?: "ACTIVE" | "ARCHIVED";
		isDefault?: boolean;
		address?: string | null;
		city?: string | null;
		countryCode?: string | null;
		phone?: string | null;
		email?: string | null;
		website?: string | null;
		socialLinks?: Record<string, string>;
		timezone?: string | null;
		currencyCode?: string | null;
		brandingId?: string | null;
	},
	schedule?: {
		weeklySlots?: WeeklySlotInput[];
		exceptions?: ExceptionInput[];
	},
) {
	return db.transaction(async (tx) => {
		await tx
			.update(schema.branch)
			.set(data)
			.where(eq(schema.branch.id, id));

		if (schedule) {
			const existingSchedule = await tx.query.schedule.findFirst({
				where: (s, { and, eq }) =>
					and(eq(s.schedulableType, "BRANCH"), eq(s.schedulableId, id)),
			});

			if (existingSchedule) {
				if (schedule.weeklySlots) {
					await tx
						.delete(schema.scheduleWeeklySlot)
						.where(eq(schema.scheduleWeeklySlot.scheduleId, existingSchedule.id));

					if (schedule.weeklySlots.length) {
						await tx.insert(schema.scheduleWeeklySlot).values(
							schedule.weeklySlots.map((slot) => ({
								scheduleId: existingSchedule.id,
								dayOfWeek: slot.dayOfWeek,
								opensAt: slot.opensAt,
								closesAt: slot.closesAt,
								closesNextDay: slot.closesNextDay ?? false,
							})),
						);
					}
				}

				if (schedule.exceptions) {
					await tx
						.delete(schema.scheduleException)
						.where(eq(schema.scheduleException.scheduleId, existingSchedule.id));

					if (schedule.exceptions.length) {
						await tx.insert(schema.scheduleException).values(
							schedule.exceptions.map((exc) => ({
								scheduleId: existingSchedule.id,
								date: exc.date,
								isClosed: exc.isClosed ?? true,
								opensAt: exc.opensAt ?? null,
								closesAt: exc.closesAt ?? null,
								reason: exc.reason ?? null,
							})),
						);
					}
				}
			}
		}

		return getBranchById(id);
	});
}

export async function deleteBranch(id: string, deletedBy?: string) {
	await betterClient.branch.delete({
		where: { id },
		...(deletedBy ? { deletedBy } : {}),
	});
}

export async function restoreBranch(id: string) {
	await db
		.update(schema.branch)
		.set({ deletedAt: null, deletedById: null })
		.where(eq(schema.branch.id, id));
	return getBranchById(id);
}

export async function setDefaultBranch(
	organizationId: string,
	branchId: string,
) {
	const branches = await betterClient.branch.findMany({
		where: { organizationId, isDefault: true },
	});

	for (const b of branches) {
		await betterClient.branch.update({
			where: { id: b.id },
			data: { isDefault: false },
		});
	}

	await betterClient.branch.update({
		where: { id: branchId },
		data: { isDefault: true },
	});
}
