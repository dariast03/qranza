import { ForgotPasswordForm } from "@auth/components/ForgotPasswordForm";
import { AuthWrapper } from "@shared/components/AuthWrapper";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/forgot-password/")({
	component: ForgotPasswordPage,
	head: () => ({
		meta: [{ title: "Forgot password" }],
	}),
});

function ForgotPasswordPage() {
	return (
		<AuthWrapper>
			<ForgotPasswordForm />
		</AuthWrapper>
	);
}
