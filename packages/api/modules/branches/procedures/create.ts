import { ORPCError } from "@orpc/server";
import { createBranch } from "@repo/database";
import { z } from "zod";

import { organizationProcedure } from "../../../orpc/procedures";

const dayOfWeekEnum = z.enum([
	"MONDAY",
	"TUESDAY",
	"WEDNESDAY",
	"THURSDAY",
	"FRIDAY",
	"SATURDAY",
	"SUNDAY",
]);

const slotSchema = z.object({
	dayOfWeek: dayOfWeekEnum,
	opensAt: z.string(),
	closesAt: z.string(),
});

export const create = organizationProcedure
	.route({
		method: "POST",
		path: "/branches",
		tags: ["Branches"],
		summary: "Create branch",
		description:
			"Create a new branch. Schedule is always created — days without slots are closed.",
	})
	.input(
		z.object({
			name: z.string().min(1).max(100),
			address: z.string().nullable().optional(),
			city: z.string().nullable().optional(),
			countryCode: z.string().nullable().optional(),
			phone: z.string().nullable().optional(),
			email: z.string().nullable().optional(),
			website: z.string().nullable().optional(),
			socialLinks: z.record(z.string(), z.string()).optional(),
			brandingId: z.string().nullable().optional(),
			schedule: z
				.object({
					weeklySlots: z.array(slotSchema).optional(),
				})
				.optional(),
		}),
	)
	.handler(async ({ input, context: { organization } }) => {
		const branch = await createBranch({
			...input,
			organizationId: organization.id,
		});

		if (!branch) {
			throw new ORPCError("INTERNAL_SERVER_ERROR", {
				message: "Failed to create branch",
			});
		}

		return branch;
	});
