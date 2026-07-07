import { OrganizationList } from "@admin/components/organizations/OrganizationList";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/admin/organizations/")({
	component: AdminOrganizationsPage,
	head: () => ({
		meta: [{ title: "Admin — Organizations" }],
	}),
});

function AdminOrganizationsPage() {
	return (
		<div className="p-2">
			<OrganizationList />
		</div>
	);
}
