import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/reports/products/")({
	component: () => <h1>Productos</h1>,
});
