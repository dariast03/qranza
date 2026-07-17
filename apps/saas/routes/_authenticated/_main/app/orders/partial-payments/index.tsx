import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/orders/partial-payments/")({
	component: () => <h1>Abonos</h1>,
});
