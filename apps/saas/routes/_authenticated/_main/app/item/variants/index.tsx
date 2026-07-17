import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/item/variants/")({
	component: () => <h1>Variantes</h1>,
});
