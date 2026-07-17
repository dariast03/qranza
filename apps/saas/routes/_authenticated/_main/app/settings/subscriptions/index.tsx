import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/settings/subscriptions/")({
	component: () => <h1>Planes y Suscripciones</h1>,
});
