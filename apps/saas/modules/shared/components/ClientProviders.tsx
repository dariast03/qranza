import { ProgressProvider } from "@bprogress/react";
import type { PropsWithChildren } from "react";
import { ConfirmDialogProvider } from "@omit/react-confirm-dialog";

export function ClientProviders({ children }: PropsWithChildren) {
	return (
		<ProgressProvider
			height="4px"
			color="var(--color-primary)"
			options={{ showSpinner: false }}
			shallowRouting
			delay={250}
		>
			<ConfirmDialogProvider>{children}</ConfirmDialogProvider>
		</ProgressProvider>
	);
}
