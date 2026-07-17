import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/")({
	component: () => <h1>Inicio</h1>,
});
