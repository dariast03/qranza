import { ORPCError } from "@orpc/server";
import { getBranchById, updateBranch } from "@repo/database";
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
	id: z.string().optional(),
	dayOfWeek: dayOfWeekEnum,
	opensAt: z.string(),
	closesAt: z.string(),
});

export const update = organizationProcedure
	.route({
		method: "PATCH",
		path: "/branches/{id}",
		tags: ["Branches"],
		summary: "Update branch",
		description:
			"Update branch fields. Optionally update schedule slots (merge).",
	})
	.input(
		z.object({
			id: z.string(),
			name: z.string().min(1).max(100).optional(),
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
	.handler(async ({ input: { id, schedule, ...data }, context: { organization } }) => {
		const existing = await getBranchById(id);

		if (!existing || existing.organizationId !== organization.id) {
			throw new ORPCError("NOT_FOUND", {
				message: "Branch not found",
			});
		}

		const branch = await updateBranch(id, data, schedule);

		if (!branch) {
			throw new ORPCError("INTERNAL_SERVER_ERROR", {
				message: "Failed to update branch",
			});
		}

		return branch;
	});
