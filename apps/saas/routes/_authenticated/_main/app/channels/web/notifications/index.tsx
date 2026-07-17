import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/channels/web/notifications/")({
	component: () => <h1>Notificaciones</h1>,
});
