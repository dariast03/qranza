import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/channels/web/storefront/")({
	component: () => <h1>Tienda</h1>,
});
