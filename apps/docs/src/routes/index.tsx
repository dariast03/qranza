import { createFileRoute } from "@tanstack/react-router";

import { FumadocsDocsRoute, loadDocsRoute } from "@/lib/fumadocs-docs-route";

export const Route = createFileRoute("/")({
	component: DocsHomePage,
	loader: () => loadDocsRoute([]),
});

function DocsHomePage() {
	return <FumadocsDocsRoute loaderData={Route.useLoaderData()} />;
}
