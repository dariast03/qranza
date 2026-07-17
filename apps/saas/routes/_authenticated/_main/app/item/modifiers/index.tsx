import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/item/modifiers/")({
	component: () => <h1>Modificadores</h1>,
});
