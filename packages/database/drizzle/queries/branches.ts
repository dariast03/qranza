import { and, eq, sql } from "drizzle-orm";

import { db } from "../client";
import { branch } from "../schema";

export async function getBranchesByOrganizationId(organizationId: string) {
	return db.query.branch.findMany({
		where: (b, { eq }) => eq(b.organizationId, organizationId),
		orderBy: (b, { asc }) => [asc(b.isDefault), asc(b.name)],
	});
}

export async function getBranchById(id: string) {
	return db.query.branch.findFirst({
		where: (b, { eq }) => eq(b.id, id),
		with: {
			organization: true,
			country: true,
			currency: true,
		},
	});
}

export async function getDefaultBranchByOrganizationId(organizationId: string) {
	return db.query.branch.findFirst({
		where: (b, { and, eq }) =>
			and(eq(b.organizationId, organizationId), eq(b.isDefault, true)),
	});
}

export async function getBranchBySlug(organizationId: string, slug: string) {
	return db.query.branch.findFirst({
		where: (b, { and, eq }) =>
			and(eq(b.organizationId, organizationId), eq(b.slug, slug)),
	});
}

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
}) {
	const [{ id }] = await db
		.insert(branch)
		.values({
			organizationId,
			name,
			slug,
			type,
			status,
			isDefault,
			address,
			city,
			countryCode,
			phone,
			email,
			website,
			socialLinks: socialLinks ?? {},
			timezone,
			currencyCode,
		})
		.returning({ id: branch.id });

	return getBranchById(id);
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
	},
) {
	await db.update(branch).set(data).where(eq(branch.id, id));
	return getBranchById(id);
}

export async function deleteBranch(id: string) {
	await db.delete(branch).where(eq(branch.id, id));
}

export async function setDefaultBranch(organizationId: string, branchId: string) {
	await db
		.update(branch)
		.set({ isDefault: false })
		.where(eq(branch.organizationId, organizationId));

	await db.update(branch).set({ isDefault: true }).where(eq(branch.id, branchId));
}
