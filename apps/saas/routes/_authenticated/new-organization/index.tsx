import { CreateOrganizationForm } from "@organizations/components/CreateOrganizationForm";
import { AuthWrapper } from "@shared/components/AuthWrapper";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/new-organization/")({
	component: NewOrganizationPage,
	head: () => ({
		meta: [{ title: "New organization" }],
	}),
});

function NewOrganizationPage() {
	return (
		<AuthWrapper>
			<CreateOrganizationForm />
		</AuthWrapper>
	);
}
