import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/item/gallery/")({
	component: () => <h1>Galería</h1>,
});
