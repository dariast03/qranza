import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/orders/payments/")({
	component: () => <h1>Pagos</h1>,
});
