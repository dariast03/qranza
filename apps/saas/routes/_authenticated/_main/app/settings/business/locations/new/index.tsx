import { NewBranchPage } from "@settings/business/locations/new";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_authenticated/_main/app/settings/business/locations/new/",
)({
	component: NewBranchPage,
});
