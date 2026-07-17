import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/item/custom-attributes/")({
	component: () => <h1>Atributos Personalizados</h1>,
});
