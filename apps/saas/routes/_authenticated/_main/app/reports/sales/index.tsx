import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/reports/sales/")({
	component: () => <h1>Ventas</h1>,
});
