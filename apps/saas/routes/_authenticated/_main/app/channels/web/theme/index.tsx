import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/channels/web/theme/")({
	component: () => <h1>Tema</h1>,
});
