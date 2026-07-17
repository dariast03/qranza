import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/settings/account/preferences/")({
	component: () => <h1>Preferencias</h1>,
});
