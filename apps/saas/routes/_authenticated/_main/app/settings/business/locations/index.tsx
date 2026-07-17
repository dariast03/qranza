import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/settings/business/locations/")({
	component: () => <h1>Sucursales</h1>,
});
