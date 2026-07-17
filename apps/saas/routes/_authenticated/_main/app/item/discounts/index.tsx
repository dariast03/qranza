import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/item/discounts/")({
	component: () => <h1>Descuentos</h1>,
});
