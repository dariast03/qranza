import { UserList } from "@admin/components/users/UserList";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/admin/users/")({
	component: AdminUsersPage,
	head: () => ({ meta: [{ title: "Admin — Users" }] }),
});

function AdminUsersPage() {
	return (
		<div className="p-2">
			<UserList />
		</div>
	);
}
