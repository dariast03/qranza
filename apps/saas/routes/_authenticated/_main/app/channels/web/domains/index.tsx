import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/channels/web/domains/")({
	component: () => <h1>Dominios</h1>,
});
