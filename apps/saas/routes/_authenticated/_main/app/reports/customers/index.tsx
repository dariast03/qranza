import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/reports/customers/")({
	component: () => <h1>Clientes</h1>,
});
