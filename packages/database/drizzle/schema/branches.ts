import { createId as cuid } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import {
	boolean,
	index,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";

import { country, currency } from "./base";
import { organization } from "./organizations";

export const branchTypeEnum = pgEnum("BranchType", ["PHYSICAL", "VIRTUAL"]);
export const branchStatusEnum = pgEnum("BranchStatus", ["ACTIVE", "ARCHIVED"]);

export type BranchSocialLinks = Partial<
	Record<"whatsapp" | "instagram" | "twitter" | "tiktok" | "facebook", string>
>;

export const branch = pgTable(
	"branch",
	{
		id: text("id")
			.$defaultFn(() => cuid())
			.primaryKey(),
		organizationId: text("organizationId")
			.notNull()
			.references(() => organization.id, { onDelete: "cascade" }),
		name: text("name").notNull(),
		slug: text("slug").notNull(),
		type: branchTypeEnum("type").default("PHYSICAL").notNull(),
		status: branchStatusEnum("status").default("ACTIVE").notNull(),
		isDefault: boolean("isDefault").default(false).notNull(),

		address: text("address"),
		city: text("city"),
		countryCode: text("countryCode").references(() => country.code, { onDelete: "set null" }),

		phone: text("phone"),
		email: text("email"),
		website: text("website"),
		socialLinks: jsonb("socialLinks").$type<BranchSocialLinks>().default({}).notNull(),

		timezone: text("timezone"),
		currencyCode: text("currencyCode").references(() => currency.code, { onDelete: "set null" }),

		createdAt: timestamp("createdAt").defaultNow().notNull(),
		updatedAt: timestamp("updatedAt")
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [
		uniqueIndex("branch_org_slug_uidx").on(table.organizationId, table.slug),
		index("branch_organizationId_idx").on(table.organizationId),
		index("branch_countryCode_idx").on(table.countryCode),
		uniqueIndex("branch_org_default_uidx")
			.on(table.organizationId)
			.where(sql`${table.isDefault} = true`),
	],
);

export const branchRelations = relations(branch, ({ one }) => ({
	organization: one(organization, {
		fields: [branch.organizationId],
		references: [organization.id],
	}),
	country: one(country, {
		fields: [branch.countryCode],
		references: [country.code],
	}),
	currency: one(currency, {
		fields: [branch.currencyCode],
		references: [currency.code],
	}),
}));
