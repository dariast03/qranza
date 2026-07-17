import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/settings/billing/")({
	component: () => <h1>Facturación</h1>,
});
