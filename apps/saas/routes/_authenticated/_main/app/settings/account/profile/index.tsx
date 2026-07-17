import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/settings/account/profile/")({
	component: () => <h1>Información Personal</h1>,
});
