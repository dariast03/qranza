import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/team/permissions/")({
	component: () => <h1>Permisos</h1>,
});
