import { and, count, eq, isNull } from "drizzle-orm";

import { db } from "../client";
import { notification, userNotificationPreference } from "../schema/postgres";

export async function getDisabledNotificationPreferences(userId: string) {
	return db
		.select({
			type: userNotificationPreference.type,
			target: userNotificationPreference.target,
		})
		.from(userNotificationPreference)
		.where(eq(userNotificationPreference.userId, userId));
}

export async function isNotificationDisabled(
	userId: string,
	type: "WELCOME" | "APP_UPDATE",
	target: "IN_APP" | "EMAIL",
) {
	const row = await db.query.userNotificationPreference.findFirst({
		where: (pref, { eq: eqFn, and: andFn }) =>
			andFn(eqFn(pref.userId, userId), eqFn(pref.type, type), eqFn(pref.target, target)),
	});
	return Boolean(row);
}

export async function setNotificationDisabled(
	userId: string,
	type: "WELCOME" | "APP_UPDATE",
	target: "IN_APP" | "EMAIL",
	disabled: boolean,
) {
	if (disabled) {
		await db
			.insert(userNotificationPreference)
			.values({ userId, type, target })
			.onConflictDoNothing({
				target: [
					userNotificationPreference.userId,
					userNotificationPreference.type,
					userNotificationPreference.target,
				],
			});
	} else {
		await db
			.delete(userNotificationPreference)
			.where(
				and(
					eq(userNotificationPreference.userId, userId),
					eq(userNotificationPreference.type, type),
					eq(userNotificationPreference.target, target),
				),
			);
	}
}

export async function listNotificationsByUserId(userId: string, limit: number) {
	return db.query.notification.findMany({
		where: (n, { eq: eqFn }) => eqFn(n.userId, userId),
		orderBy: (n, { desc: descFn }) => [descFn(n.createdAt)],
		limit,
	});
}

export async function getUnreadNotificationCountByUserId(userId: string) {
	const [row] = await db
		.select({ c: count() })
		.from(notification)
		.where(and(eq(notification.userId, userId), isNull(notification.readAt)));
	return Number(row?.c ?? 0);
}

export async function markNotificationAsReadById(notificationId: string, userId: string) {
	const [updated] = await db
		.update(notification)
		.set({ readAt: new Date() })
		.where(and(eq(notification.id, notificationId), eq(notification.userId, userId)))
		.returning({ id: notification.id });
	return updated ?? null;
}

export async function markAllNotificationsAsReadForUser(userId: string) {
	await db
		.update(notification)
		.set({ readAt: new Date() })
		.where(and(eq(notification.userId, userId), isNull(notification.readAt)));
}

export async function createNotificationForUser({
	userId,
	type,
	title,
	body,
	link,
}: {
	userId: string;
	type: string;
	title: string;
	body: string;
	link?: string | null;
}) {
	const [row] = await db
		.insert(notification)
		.values({
			userId,
			type,
			title,
			body,
			link: link ?? null,
		})
		.returning();
	return row;
}
