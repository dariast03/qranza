import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/orders/shipping/")({
	component: () => <h1>Envíos</h1>,
});
