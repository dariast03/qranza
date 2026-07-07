import { ResetPasswordForm } from "@auth/components/ResetPasswordForm";
import { AuthWrapper } from "@shared/components/AuthWrapper";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/reset-password/")({
	component: ResetPasswordPage,
	head: () => ({
		meta: [{ title: "Reset password" }],
	}),
});

function ResetPasswordPage() {
	return (
		<AuthWrapper>
			<ResetPasswordForm />
		</AuthWrapper>
	);
}
