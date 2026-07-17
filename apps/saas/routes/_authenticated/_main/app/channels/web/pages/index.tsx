import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/channels/web/pages/")({
	component: () => <h1>Páginas</h1>,
});
