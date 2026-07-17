import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/orders/returns/")({
	component: () => <h1>Devoluciones</h1>,
});
