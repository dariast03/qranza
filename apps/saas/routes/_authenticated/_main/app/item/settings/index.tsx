import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/item/settings/")({
	component: () => <h1>Ajustes del Catálogo</h1>,
});
