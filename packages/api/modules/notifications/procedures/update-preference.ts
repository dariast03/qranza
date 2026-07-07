import { setNotificationDisabled } from "@repo/notifications";
import { z } from "zod";

import { protectedProcedure } from "../../../orpc/procedures";

const notificationTypeSchema = z.enum(["WELCOME", "APP_UPDATE"]);
const notificationTargetSchema = z.enum(["IN_APP", "EMAIL"]);

export const updatePreference = protectedProcedure
	.route({
		method: "PUT",
		path: "/notifications/preferences",
		tags: ["Notifications"],
		summary: "Update a notification preference",
	})
	.input(
		z.object({
			type: notificationTypeSchema,
			target: notificationTargetSchema,
			disabled: z.boolean(),
		}),
	)
	.handler(async ({ input: { type, target, disabled }, context: { user } }) => {
		await setNotificationDisabled(user.id, type, target, disabled);
		return { ok: true as const };
	});
