import { markNotificationAsReadById } from "@repo/database";
import { z } from "zod";

import { protectedProcedure } from "../../../orpc/procedures";

export const markAsRead = protectedProcedure
	.route({
		method: "POST",
		path: "/notifications/mark-as-read",
		tags: ["Notifications"],
		summary: "Mark one notification as read",
	})
	.input(
		z.object({
			notificationId: z.string(),
		}),
	)
	.handler(async ({ input, context: { user } }) => {
		const result = await markNotificationAsReadById(input.notificationId, user.id);
		return { ok: Boolean(result) };
	});
