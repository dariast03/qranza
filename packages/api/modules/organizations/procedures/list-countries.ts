import { getAllCountries } from "@repo/database";
import { z } from "zod";

import { publicProcedure } from "../../../orpc/procedures";

export const listCountries = publicProcedure
	.route({
		method: "GET",
		path: "/organizations/countries",
		tags: ["Organizations"],
		summary: "List countries",
		description: "Get all countries for onboarding selection",
	})
	.output(
		z.array(
			z.object({
				code: z.string(),
				name: z.string(),
				currencyCode: z.string(),
			}),
		),
	)
	.handler(async () => {
		const countries = await getAllCountries();
		return countries.map((c) => ({
			code: c.code,
			name: c.name,
			currencyCode: c.currencyCode,
		}));
	});
