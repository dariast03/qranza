import { createId as cuid } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import {
	boolean,
	index,
	jsonb,
	numeric,
	pgEnum,
	pgTable,
	text,
	uniqueIndex,
} from "drizzle-orm/pg-core";

import { baseColumns, country, softDeleteColumns } from "./base";
import { user } from "./auth";
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
		brandingId: text("brandingId").references(() => branding.id, {
			onDelete: "set null",
		}),
		name: text("name").notNull(),
		type: branchTypeEnum("type").default("PHYSICAL").notNull(),
		status: branchStatusEnum("status").default("ACTIVE").notNull(),
		isDefault: boolean("isDefault").default(false).notNull(),

		address: text("address"),
		city: text("city"),
		countryCode: text("countryCode").references(() => country.code, {
			onDelete: "set null",
		}),
		latitude: numeric("latitude", { precision: 9, scale: 6 }),
		longitude: numeric("longitude", { precision: 9, scale: 6 }),

		phone: text("phone"),
		email: text("email"),
		website: text("website"),
		socialLinks: jsonb("socialLinks")
			.$type<BranchSocialLinks>()
			.default({})
			.notNull(),

		...baseColumns,
	},
	(table) => [
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
	branding: one(branding, {
		fields: [branch.brandingId],
		references: [branding.id],
	}),
	country: one(country, {
		fields: [branch.countryCode],
		references: [country.code],
	}),
	deletedBy: one(user, {
		fields: [branch.deletedById],
		references: [user.id],
	}),
}));

export const branding = pgTable(
	"branding",
	{
		id: text("id")
			.$defaultFn(() => cuid())
			.primaryKey(),
		organizationId: text("organizationId")
			.notNull()
			.references(() => organization.id, { onDelete: "cascade" }),
		name: text("name").notNull(),
		logoUrl: text("logoUrl"),
		primaryColor: text("primaryColor"),
		...baseColumns,
	},
	(table) => [index("branding_organizationId_idx").on(table.organizationId)],
);

export const brandingRelations = relations(branding, ({ one, many }) => ({
	organization: one(organization, {
		fields: [branding.organizationId],
		references: [organization.id],
	}),
	branches: many(branch),
	deletedBy: one(user, {
		fields: [branding.deletedById],
		references: [user.id],
	}),
}));
