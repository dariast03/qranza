import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/item/units/")({
	component: () => <h1>Unidades</h1>,
});
