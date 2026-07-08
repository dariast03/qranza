import { eq, isNull } from "drizzle-orm";

import { db } from "../client";
import { industry } from "../schema";

export async function getParentIndustries() {
	return db.query.industry.findMany({
		where: (i, { isNull }) => isNull(i.parentId),
		orderBy: (i, { asc }) => [asc(i.name)],
	});
}

export async function getChildrenByParentId(parentId: string) {
	return db.query.industry.findMany({
		where: (i, { eq }) => eq(i.parentId, parentId),
		orderBy: (i, { asc }) => [asc(i.name)],
	});
}

export async function getIndustryByCode(code: string) {
	return db.query.industry.findFirst({
		where: (i, { eq }) => eq(i.code, code),
	});
}

export async function getIndustriesWithChildren() {
	const parents = await db.query.industry.findMany({
		where: (i, { isNull }) => isNull(i.parentId),
		orderBy: (i, { asc }) => [asc(i.name)],
	});

	const result = await Promise.all(
		parents.map(async (parent) => ({
			...parent,
			children: await getChildrenByParentCode(parent.code),
		})),
	);

	return result;
}

async function getChildrenByParentCode(parentCode: string) {
	return db.query.industry.findMany({
		where: (i, { eq }) => eq(i.parentId, parentCode),
		orderBy: (i, { asc }) => [asc(i.name)],
	});
}
