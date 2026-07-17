import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/item/all/")({
	component: () => <h1>Artículos</h1>,
});
