import { faker } from "@faker-js/faker";

import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { isNotNull } from "drizzle-orm";
import { organization } from "../schema/organizations";
import { organizationProfile } from "../schema/organization-profile";
import { branch, branding } from "../schema/branches";
import { schedule, scheduleWeeklySlot } from "../schema/schedule";
import { industry, country, currency } from "../schema/base";

const DAYS_OF_WEEK = [
	"MONDAY",
	"TUESDAY",
	"WEDNESDAY",
	"THURSDAY",
	"FRIDAY",
	"SATURDAY",
	"SUNDAY",
] as const;

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}

function randomTimeSlot(): { opensAt: string; closesAt: string } {
	const openHour = faker.number.int({ min: 6, max: 12 });
	const closeHour = faker.number.int({ min: openHour + 4, max: 22 });
	return {
		opensAt: `${String(openHour).padStart(2, "0")}:00`,
		closesAt: `${String(closeHour).padStart(2, "0")}:00`,
	};
}

function randomWorkingDays() {
	return faker.helpers.arrayElements([...DAYS_OF_WEEK], faker.number.int({ min: 5, max: 7 }));
}

async function createOrg(
	db: NodePgDatabase<Record<string, never>>,
) {
	const name = faker.company.name();
	return db
		.insert(organization)
		.values({
			name,
			slug: slugify(name),
			createdAt: new Date(),
		})
		.returning({ id: organization.id, name: organization.name });
}

async function createOrgProfile(
	db: NodePgDatabase<Record<string, never>>,
	orgId: string,
	industryCode: string,
	countryCode: string,
	currencyCode: string,
) {
	return db
		.insert(organizationProfile)
		.values({
			organizationId: orgId,
			industryCode,
			countryCode,
			currencyCode,
			timezone: "America/La_Paz",
			city: faker.location.city(),
			address: faker.location.streetAddress(),
		})
		.returning({ id: organizationProfile.id });
}

async function createBranding(
	db: NodePgDatabase<Record<string, never>>,
	orgId: string,
) {
	const colors = ["#1A73E8", "#E8175D", "#0FA3B1", "#FF6B35", "#6C5CE7", "#2ECC71", "#E74C3C", "#F39C12"];
	return db
		.insert(branding)
		.values({
			organizationId: orgId,
			name: faker.commerce.productName(),
			primaryColor: faker.helpers.arrayElement(colors),
			createdAt: new Date(),
		})
		.returning({ id: branding.id });
}

async function createBranch(
	db: NodePgDatabase<Record<string, never>>,
	orgId: string,
	countryCode: string,
	_currencyCode: string,
	isDefault: boolean,
	brandingId?: string,
) {
	const name = faker.company.name();
	return db
		.insert(branch)
		.values({
			organizationId: orgId,
			brandingId: brandingId ?? null,
			name,
			type: "PHYSICAL",
			status: "ACTIVE",
			isDefault,
			address: faker.location.streetAddress(),
			city: faker.location.city(),
			countryCode,
			latitude: String(faker.location.latitude({ min: -90, max: 90 })),
			longitude: String(faker.location.longitude({ min: -180, max: 180 })),
			phone: faker.phone.number(),
			email: faker.internet.email(),
			socialLinks: {},
			createdAt: new Date(),
		})
		.returning({ id: branch.id });
}

async function createSchedule(
	db: NodePgDatabase<Record<string, never>>,
	orgId: string,
	branchId: string,
) {
	const [scheduleRow] = await db
		.insert(schedule)
		.values({
			organizationId: orgId,
			schedulableType: "BRANCH",
			schedulableId: branchId,
			isEnabled: true,
			createdAt: new Date(),
		})
		.returning({ id: schedule.id });

	const slots = randomWorkingDays().map((day) => {
		const { opensAt, closesAt } = randomTimeSlot();
		return {
			scheduleId: scheduleRow.id,
			dayOfWeek: day,
			opensAt,
			closesAt,
			closesNextDay: false,
		};
	});

	await db.insert(scheduleWeeklySlot).values(slots);
	return scheduleRow;
}

async function createBranchesWithSchedules(
	db: NodePgDatabase<Record<string, never>>,
	orgId: string,
	countryCode: string,
	currencyCode: string,
) {
	const branchCount = faker.number.int({ min: 1, max: 3 });
	let branchesCreated = 0;
	let schedulesCreated = 0;
	let brandingsCreated = 0;

	const hasBranding = faker.datatype.boolean(0.6);
	let brandingId: string | undefined;

	if (hasBranding) {
		const [brandingRow] = await createBranding(db, orgId);
		brandingId = brandingRow.id;
		brandingsCreated++;
	}

	for (let j = 0; j < branchCount; j++) {
		const isDefault = j === 0;
		const assignBranding = isDefault && brandingId ? brandingId : undefined;
		const [branchRow] = await createBranch(db, orgId, countryCode, currencyCode, isDefault, assignBranding);
		branchesCreated++;

		if (!faker.datatype.boolean(0.7)) continue;
		await createSchedule(db, orgId, branchRow.id);
		schedulesCreated++;
	}

	return { branchesCreated, schedulesCreated, brandingsCreated };
}

export const name = "organizations";

export async function seed(
	db: NodePgDatabase<Record<string, never>>,
	count = 1,
) {
	const [existingOrgs] = await db
		.select({ id: organization.id })
		.from(organization)
		.limit(1);

	if (existingOrgs) {
		console.log("  [organizations] skipped (already exist)");
		return;
	}

	const industriesRows = await db
		.select({ code: industry.code })
		.from(industry)
		.where(isNotNull(industry.parentId));
	const countriesRows = await db.select({ code: country.code }).from(country);
	const currenciesRows = await db.select({ code: currency.code }).from(currency);

	if (industriesRows.length === 0 || countriesRows.length === 0 || currenciesRows.length === 0) {
		console.error("  [organizations] error: run base seeders first (languages, currencies, countries, industries)");
		return;
	}

	let orgsCreated = 0;
	let totalBranches = 0;
	let totalSchedules = 0;
	let totalBrandings = 0;

	for (let i = 0; i < count; i++) {
		const industryRow = faker.helpers.arrayElement(industriesRows);
		const countryRow = faker.helpers.arrayElement(countriesRows);
		const currencyRow = faker.helpers.arrayElement(currenciesRows);

		const [org] = await createOrg(db);
		await createOrgProfile(db, org.id, industryRow.code, countryRow.code, currencyRow.code);
		orgsCreated++;

		const { branchesCreated, schedulesCreated, brandingsCreated } = await createBranchesWithSchedules(
			db,
			org.id,
			countryRow.code,
			currencyRow.code,
		);

		totalBranches += branchesCreated;
		totalSchedules += schedulesCreated;
		totalBrandings += brandingsCreated;
	}

	console.log(`  [organizations] ${orgsCreated} orgs, ${totalBranches} branches, ${totalSchedules} schedules, ${totalBrandings} brandings`);
}
