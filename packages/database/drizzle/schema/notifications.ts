import { createId as cuid } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { boolean, index, pgEnum, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

import { user } from "./auth";

export const notificationTypeEnum = pgEnum("NotificationType", ["WELCOME", "APP_UPDATE"]);

export const notificationTargetEnum = pgEnum("NotificationTarget", ["IN_APP", "EMAIL"]);

export const notification = pgTable(
	"notification",
	{
		id: text("id")
			.$defaultFn(() => cuid())
			.primaryKey(),
		userId: text("userId")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		type: text("type").notNull(),
		title: text("title").notNull(),
		body: text("body").notNull(),
		link: text("link"),
		readAt: timestamp("readAt"),
		createdAt: timestamp("createdAt").defaultNow().notNull(),
	},
	(table) => [
		index("notification_userId_idx").on(table.userId),
		index("notification_userId_readAt_idx").on(table.userId, table.readAt),
	],
);

export const userNotificationPreference = pgTable(
	"user_notification_preference",
	{
		id: text("id")
			.$defaultFn(() => cuid())
			.primaryKey(),
		userId: text("userId")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		type: notificationTypeEnum("type").notNull(),
		target: notificationTargetEnum("target").notNull(),
		createdAt: timestamp("createdAt").defaultNow().notNull(),
	},
	(table) => [
		index("user_notification_preference_userId_idx").on(table.userId),
		uniqueIndex("user_notification_preference_user_type_target_uidx").on(
			table.userId,
			table.type,
			table.target,
		),
	],
);

export const userNotificationPreferences = pgTable("user_notification_preferences", {
	userId: text("userId")
		.primaryKey()
		.references(() => user.id, { onDelete: "cascade" }),
	emailNewsletter: boolean("emailNewsletter").default(true).notNull(),
	emailProductUpdates: boolean("emailProductUpdates").default(true).notNull(),
	emailAccountSecurity: boolean("emailAccountSecurity").default(true).notNull(),
	updatedAt: timestamp("updatedAt")
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const notificationRelations = relations(notification, ({ one }) => ({
	user: one(user, {
		fields: [notification.userId],
		references: [user.id],
	}),
}));

export const userNotificationPreferencesRelations = relations(
	userNotificationPreferences,
	({ one }) => ({
		user: one(user, {
			fields: [userNotificationPreferences.userId],
			references: [user.id],
		}),
	}),
);

export const userNotificationPreferenceRelations = relations(
	userNotificationPreference,
	({ one }) => ({
		user: one(user, {
			fields: [userNotificationPreference.userId],
			references: [user.id],
		}),
	}),
);
