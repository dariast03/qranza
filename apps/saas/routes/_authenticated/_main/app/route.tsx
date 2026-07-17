import { createFileRoute, Outlet } from "@tanstack/react-router";
import { getDashboardLayout } from "@server/server-actions";
import AppLayout from "@shared/layouts/app-layout";

export const Route = createFileRoute("/_authenticated/_main/app")({
	loader: () => getDashboardLayout(),
	component: AppRouteLayout,
});

function AppRouteLayout() {
	const { defaultOpen, variant, collapsible } = Route.useLoaderData();

	return (
		<AppLayout
			defaultOpen={defaultOpen}
			variant={variant}
			collapsible={collapsible}
		>
			<Outlet />
		</AppLayout>
	);
}
