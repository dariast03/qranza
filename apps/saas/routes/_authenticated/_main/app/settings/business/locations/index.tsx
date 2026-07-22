import { LocationsPage } from "@settings/business/locations/index";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_authenticated/_main/app/settings/business/locations/",
)({
	component: LocationsPage,
});
