import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/reports/")({
	component: () => <h1>Reportes</h1>,
});
