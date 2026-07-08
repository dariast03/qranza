import { db } from "../client";

export async function getCountryByCode(code: string) {
	return db.query.country.findFirst({
		where: (c, { eq }) => eq(c.code, code),
	});
}

export async function getAllCountries() {
	return db.query.country.findMany({
		orderBy: (c, { asc }) => [asc(c.name)],
	});
}
