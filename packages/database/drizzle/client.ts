import { better } from "better-drizzle";
import { softDelete } from "@better-drizzle/soft-delete";
import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";

// Check the drizzle documentation for more information on how to connect to your preferred database provider
// https://orm.drizzle.team/docs/get-started-postgresql

const databaseUrl =
	process.env.DATABASE_URL ??
	"postgresql://postgres:postgres@localhost:5432/supastarter";

export const db = drizzle(databaseUrl, {
	schema,
});

export const betterClient = better(db, {
	schema,
	plugins: [
		softDelete({
			column: "deletedAt",
			deletedByColumn: "deletedById",
			defaults: {
				mode: "soft",
				visibility: "without",
			},
		}),
	],
});
