import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/channels/web/navigation/")({
	component: () => <h1>Navegación</h1>,
});
