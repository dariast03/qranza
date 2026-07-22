import { EditBranchPage } from "@settings/business/locations/edit";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_authenticated/_main/app/settings/business/locations/$branchId/",
)({
	component: EditBranchRouteComponent,
});

function EditBranchRouteComponent() {
	const { branchId } = Route.useParams();
	return <EditBranchPage branchId={branchId} />;
}
