import { orpc } from "@shared/lib/orpc-query-utils";
import { useQuery } from "@tanstack/react-query";

import type { BrandingOption } from "../types/branch";

export function useBrandings() {
	return useQuery({
		...orpc.brandings.list.queryOptions(),
		select: (data): BrandingOption[] =>
			data.map((b) => ({
				id: b.id,
				name: b.name,
				logoUrl: b.logoUrl,
				primaryColor: b.primaryColor,
			})),
	});
}
