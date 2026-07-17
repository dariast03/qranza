import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/team/members/")({
	component: () => <h1>Miembros</h1>,
});
