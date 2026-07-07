import { drizzle } from "drizzle-orm/node-postgres";

import * as languagesSeed from "./languages";
import * as currenciesSeed from "./currencies";
import * as countriesSeed from "./countries";
import * as industriesSeed from "./industries";

const databaseUrl =
	process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/supastarter";

const db = drizzle(databaseUrl);

const seeders = [languagesSeed, currenciesSeed, countriesSeed, industriesSeed] as const;

const filterName = process.argv[2];

async function main() {
	console.log("Running seeders...\n");

	const toRun = filterName
		? seeders.filter((s) => s.name === filterName)
		: [...seeders];

	if (filterName && toRun.length === 0) {
		console.error(`Seeder "${filterName}" not found.`);
		console.error(`Available seeders: ${seeders.map((s) => s.name).join(", ")}`);
		process.exit(1);
	}

	for (const seeder of toRun) {
		await seeder.seed(db);
	}

	console.log("\nDone.");
	process.exit(0);
}

main().catch((err) => {
	console.error("Seed failed:", err);
	process.exit(1);
});
