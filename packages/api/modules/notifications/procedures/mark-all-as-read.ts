import { markAllNotificationsAsReadForUser } from "@repo/database";

import { protectedProcedure } from "../../../orpc/procedures";

export const markAllAsRead = protectedProcedure
	.route({
		method: "POST",
		path: "/notifications/mark-all-as-read",
		tags: ["Notifications"],
		summary: "Mark all notifications as read",
	})
	.handler(async ({ context: { user } }) => {
		await markAllNotificationsAsReadForUser(user.id);
		return { ok: true as const };
	});
