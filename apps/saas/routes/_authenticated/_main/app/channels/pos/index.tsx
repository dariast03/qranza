import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/channels/pos/")({
	component: () => <h1>Punto de Venta</h1>,
});
