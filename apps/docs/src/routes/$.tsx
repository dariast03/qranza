import { createFileRoute } from "@tanstack/react-router";

import { FumadocsDocsRoute, loadDocsRoute } from "@/lib/fumadocs-docs-route";

export const Route = createFileRoute("/$")({
	component: DocsSplatPage,
	loader: async ({ params }) => {
		const slugs = (params._splat?.split("/") ?? []).filter(Boolean);
		return loadDocsRoute(slugs);
	},
});

function DocsSplatPage() {
	return <FumadocsDocsRoute loaderData={Route.useLoaderData()} />;
}
