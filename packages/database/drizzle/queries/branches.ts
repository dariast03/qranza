import { and, eq, ilike, or, sql, desc, asc } from "drizzle-orm";
import { betterClient, db } from "../client";
import * as schema from "../schema";

type BranchSortField = "name" | "type" | "status" | "city" | "createdAt";

export type BranchListParams = {
	organizationId: string;
	limit?: number;
	offset?: number;
	query?: string;
	sort?: {
		field: BranchSortField;
		direction: "asc" | "desc";
	};
};

export async function getBranchesByOrganizationId(params: BranchListParams) {
	const { organizationId, limit = 10, offset = 0, query, sort } = params;

	const conditions = [eq(schema.branch.organizationId, organizationId)];

	if (query) {
		const searchPattern = `%${query}%`;
		conditions.push(
			or(
				ilike(schema.branch.name, searchPattern),
				ilike(schema.branch.city, searchPattern),
				ilike(schema.branch.email, searchPattern),
			)!,
		);
	}

	const sortColumn = sort?.field === "city"
		? schema.branch.city
		: sort?.field === "name"
			? schema.branch.name
			: sort?.field === "type"
				? schema.branch.type
				: sort?.field === "status"
					? schema.branch.status
					: schema.branch.createdAt;

	const sortFn = sort?.direction === "desc" ? desc : asc;

	const rows = await db
		.select()
		.from(schema.branch)
		.where(and(...conditions))
		.orderBy(sort?.field === "name" ? sortFn(sortColumn) : sortFn(sortColumn))
		.limit(limit)
		.offset(offset);

	return rows;
}

export async function countBranchesByOrganizationId(
	organizationId: string,
	query?: string,
) {
	const conditions = [eq(schema.branch.organizationId, organizationId)];

	if (query) {
		const searchPattern = `%${query}%`;
		conditions.push(
			or(
				ilike(schema.branch.name, searchPattern),
				ilike(schema.branch.city, searchPattern),
				ilike(schema.branch.email, searchPattern),
			)!,
		);
	}

	const [result] = await db
		.select({ count: sql<number>`count(*)::int` })
		.from(schema.branch)
		.where(and(...conditions));

	return result.count;
}

export async function getBranchById(id: string) {
	const branchData = await betterClient.branch.findUnique({
		where: { id },
		include: {
			organization: true,
			country: true,
			branding: true,
		},
	});

	if (!branchData) return null;

	const scheduleData = await db.query.schedule.findFirst({
		where: (s, { and, eq }) =>
			and(eq(s.schedulableType, "BRANCH"), eq(s.schedulableId, id)),
		with: {
			weeklySlots: true,
		},
	});

	return { ...branchData, schedule: scheduleData ?? null };
}

export async function getDefaultBranchByOrganizationId(organizationId: string) {
	return betterClient.branch.findFirst({
		where: { organizationId, isDefault: true },
	});
}

type DayOfWeek = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";

type WeeklySlotInput = {
	dayOfWeek: DayOfWeek;
	opensAt: string;
	closesAt: string;
};

export async function createBranch({
	organizationId,
	name,
	isDefault = false,
	address,
	city,
	countryCode,
	phone,
	email,
	website,
	socialLinks,
	brandingId,
	schedule,
}: {
	organizationId: string;
	name: string;
	isDefault?: boolean;
	address?: string | null;
	city?: string | null;
	countryCode?: string | null;
	phone?: string | null;
	email?: string | null;
	website?: string | null;
	socialLinks?: Record<string, string>;
	brandingId?: string | null;
	schedule?: {
		weeklySlots?: WeeklySlotInput[];
	};
}) {
	return db.transaction(async (tx) => {
		const [{ id: branchId }] = await tx
			.insert(schema.branch)
			.values({
				organizationId,
				brandingId: brandingId ?? null,
				name,
				isDefault,
				address: address ?? null,
				city: city ?? null,
				countryCode: countryCode ?? null,
				phone: phone ?? null,
				email: email ?? null,
				website: website ?? null,
				socialLinks: socialLinks ?? {},
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
					closesNextDay: false,
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
		isDefault?: boolean;
		address?: string | null;
		city?: string | null;
		countryCode?: string | null;
		phone?: string | null;
		email?: string | null;
		website?: string | null;
		socialLinks?: Record<string, string>;
		brandingId?: string | null;
	},
	schedule?: {
		weeklySlots?: WeeklySlotInput[];
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
								closesNextDay: false,
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
