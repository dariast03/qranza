import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/reports/inventory/")({
	component: () => <h1>Inventario</h1>,
});
