import { createId as cuid } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { country, currency, industry } from "./base";
import { organization } from "./organizations";

export const organizationProfile = pgTable(
	"organization_profile",
	{
		id: text("id")
			.$defaultFn(() => cuid())
			.primaryKey(),
		organizationId: text("organizationId")
			.notNull()
			.unique()
			.references(() => organization.id, { onDelete: "cascade" }),
		industryCode: text("industryCode")
			.notNull()
			.references(() => industry.code),
		countryCode: text("countryCode")
			.notNull()
			.references(() => country.code),
		currencyCode: text("currencyCode")
			.notNull()
			.references(() => currency.code),
		timezone: text("timezone").notNull(),
		city: text("city"),
		address: text("address"),
		createdAt: timestamp("createdAt").defaultNow().notNull(),
		updatedAt: timestamp("updatedAt")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		index("organization_profile_organizationId_idx").on(table.organizationId),
	],
);

export const organizationProfileRelations = relations(
	organizationProfile,
	({ one }) => ({
		organization: one(organization, {
			fields: [organizationProfile.organizationId],
			references: [organization.id],
		}),
		country: one(country, {
			fields: [organizationProfile.countryCode],
			references: [country.code],
		}),
		currency: one(currency, {
			fields: [organizationProfile.currencyCode],
			references: [currency.code],
		}),
		industry: one(industry, {
			fields: [organizationProfile.industryCode],
			references: [industry.code],
		}),
	}),
);
