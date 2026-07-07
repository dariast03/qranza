import { markNotificationAsReadById } from "@repo/database";
import { z } from "zod";

import { protectedProcedure } from "../../../orpc/procedures";

export const markNotificationsRead = protectedProcedure
	.route({
		method: "POST",
		path: "/notifications/mark-read",
		tags: ["Notifications"],
		summary: "Mark notifications as read",
	})
	.input(
		z.object({
			ids: z.array(z.string()).max(100),
		}),
	)
	.handler(async ({ input: { ids }, context: { user } }) => {
		await Promise.all(ids.map((id) => markNotificationAsReadById(id, user.id)));
		return { ok: true as const };
	});
