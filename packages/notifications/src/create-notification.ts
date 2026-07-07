import { createNotificationForUser, getUserById, isNotificationDisabled } from "@repo/database";
import type { Locale } from "@repo/i18n";
import { sendEmail } from "@repo/mail";

import { resolveNotificationLink } from "./resolve-link";
import { NOTIFICATION_TARGETS, type NotificationType } from "./types";

function getRecordData(data: unknown): Record<string, unknown> {
	return data && typeof data === "object" && !Array.isArray(data)
		? (data as Record<string, unknown>)
		: {};
}

function getTitle(type: NotificationType, data: Record<string, unknown>): string {
	const explicitTitle = data.title ?? data.headline;
	return typeof explicitTitle === "string" && explicitTitle.length > 0 ? explicitTitle : type;
}

function getMessage(data: Record<string, unknown>): string {
	return typeof data.message === "string" ? data.message : "";
}

export async function createNotification(input: {
	userId: string;
	type: NotificationType;
	data?: unknown;
	link?: string | null;
	read?: boolean;
}) {
	const data = getRecordData(input.data);
	const title = getTitle(input.type, data);
	const body = getMessage(data);
	const absoluteLink = resolveNotificationLink(input.link);

	const [inAppDisabled, emailDisabled] = await Promise.all([
		isNotificationDisabled(input.userId, input.type, NOTIFICATION_TARGETS.IN_APP),
		isNotificationDisabled(input.userId, input.type, NOTIFICATION_TARGETS.EMAIL),
	]);

	const created = inAppDisabled
		? null
		: await createNotificationForUser({
				userId: input.userId,
				type: input.type,
				title,
				body,
				link: absoluteLink,
			});

	if (!emailDisabled) {
		const user = await getUserById(input.userId);

		if (user?.email) {
			await sendEmail({
				to: user.email,
				locale: (user.locale as Locale | null | undefined) ?? undefined,
				templateId: "notification",
				context: {
					title,
					message: body || undefined,
					link: absoluteLink ?? undefined,
				},
			});
		}
	}

	return created;
}
