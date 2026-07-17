import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/channels/web/seo/")({
	component: () => <h1>SEO</h1>,
});
