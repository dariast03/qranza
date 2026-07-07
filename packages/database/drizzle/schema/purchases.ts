import { createId as cuid } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth";
import { organization } from "./organizations";

export const purchaseTypeEnum = pgEnum("PurchaseType", ["SUBSCRIPTION", "ONE_TIME"]);

export const purchase = pgTable("purchase", {
	id: text("id")
		.$defaultFn(() => cuid())
		.primaryKey(),
	organizationId: text("organizationId").references(() => organization.id, {
		onDelete: "cascade",
	}),
	userId: text("userId").references(() => user.id, {
		onDelete: "cascade",
	}),
	type: purchaseTypeEnum("type").notNull(),
	customerId: text("customerId").notNull(),
	subscriptionId: text("subscriptionId").unique(),
	priceId: text("priceId").notNull(),
	status: text("status"),
	createdAt: timestamp("createdAt").defaultNow().notNull(),
	updatedAt: timestamp("updatedAt"),
});

export const purchaseRelations = relations(purchase, ({ one }) => ({
	organization: one(organization, {
		fields: [purchase.organizationId],
		references: [organization.id],
	}),
	user: one(user, {
		fields: [purchase.userId],
		references: [user.id],
	}),
}));
