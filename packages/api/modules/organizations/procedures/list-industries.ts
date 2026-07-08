import { getIndustriesWithChildren } from "@repo/database";
import { z } from "zod";

import { publicProcedure } from "../../../orpc/procedures";

export const listIndustries = publicProcedure
	.route({
		method: "GET",
		path: "/organizations/industries",
		tags: ["Organizations"],
		summary: "List industries with children",
		description:
			"Get all parent industries with their children for onboarding selection",
	})
	.output(
		z.array(
			z.object({
				code: z.string(),
				name: z.string(),
				icon: z.string().nullable(),
				children: z.array(
					z.object({
						code: z.string(),
						name: z.string(),
						icon: z.string().nullable(),
					}),
				),
			}),
		),
	)
	.handler(async () => {
		return getIndustriesWithChildren();
	});
