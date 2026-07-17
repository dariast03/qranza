import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/orders/")({
	component: () => <h1>Ordenes</h1>,
});
