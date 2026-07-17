import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/app/settings/account/security/")({
	component: () => <h1>Seguridad</h1>,
});
