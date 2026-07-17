import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/item/categories/")({
	component: () => <h1>Categorías</h1>,
});
