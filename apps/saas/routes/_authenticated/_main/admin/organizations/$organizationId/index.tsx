import { OrganizationForm } from "@admin/components/organizations/OrganizationForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/admin/organizations/$organizationId/")({
	component: AdminOrganizationEditPage,
	head: () => ({ meta: [{ title: "Admin — Organization" }] }),
});

function AdminOrganizationEditPage() {
	const { organizationId } = Route.useParams();
	return (
		<div className="max-w-3xl p-2 mx-auto">
			<OrganizationForm organizationId={organizationId} />
		</div>
	);
}
