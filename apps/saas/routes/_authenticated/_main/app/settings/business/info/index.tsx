import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/settings/business/info/")({
	component: () => <h1>Información del Negocio</h1>,
});
