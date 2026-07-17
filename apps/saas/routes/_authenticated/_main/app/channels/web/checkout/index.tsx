import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/channels/web/checkout/")({
	component: () => <h1>Checkout</h1>,
});
