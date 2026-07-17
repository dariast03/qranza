import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/settings/notifications/")({
	component: () => <h1>Notificaciones</h1>,
});
