import { SessionProvider } from "@auth/components/SessionProvider";
import { config } from "@config";
import { I18nProvider } from "@i18n/provider";
import { getCurrentLocale } from "@repo/i18n/runtime";
import { Button, cn, ThemeProvider, Toaster } from "@repo/ui";
// Button is used by the error boundary to render a "Try again" action.
import { ApiClientProvider } from "@shared/components/ApiClientProvider";
import { ClientProviders } from "@shared/components/ClientProviders";
import {
	createRootRoute,
	ErrorComponent,
	HeadContent,
	Link,
	Outlet,
	Scripts,
	useRouter,
	useRouterState,
} from "@tanstack/react-router";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";

import appCss from "./globals.css?url";
import "cropperjs/dist/cropper.css";
import { PREFERENCE_DEFAULTS } from "@shared/lib/preferences/preferences-config";
import { ThemeBootScript } from "@scripts/theme-boot";
import { PreferencesStoreProvider } from "@shared/stores/preferences/preferences-provider";
import { NotFound } from "./-components/not-found";
import { RootError } from "./-components/root-error";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{ title: config.appName },
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..700;1,300..700&display=swap",
			},
		],
	}),
	component: RootLayout,
	errorComponent: RootError,
	notFoundComponent: NotFound,
});

function RootLayout() {
	useRouterState({ select: (s) => s.location.pathname });

	const locale = getCurrentLocale();

	const {
		theme_mode,
		theme_preset,
		content_layout,
		navbar_style,
		sidebar_variant,
		sidebar_collapsible,
		font,
	} = PREFERENCE_DEFAULTS;

	return (
		<html
			lang={locale}
			data-theme-mode={theme_mode}
			data-theme-preset={theme_preset}
			data-content-layout={content_layout}
			data-navbar-style={navbar_style}
			data-sidebar-variant={sidebar_variant}
			data-sidebar-collapsible={sidebar_collapsible}
			data-font={font}
			suppressHydrationWarning
		>
			<head>
				<ThemeBootScript />
				<HeadContent />
			</head>
			<body
				className={cn(
					"min-h-screen bg-background text-foreground antialiased",
				)}
			>
				<NuqsAdapter>
					{/* 	<ThemeProvider defaultTheme={config.defaultTheme}> */}
					<ApiClientProvider>
						<SessionProvider>
							<ClientProviders>
								<I18nProvider>
									<PreferencesStoreProvider
										initialValues={PREFERENCE_DEFAULTS}
									>
										<Outlet />
										<Toaster position="top-right" />
									</PreferencesStoreProvider>
								</I18nProvider>
							</ClientProviders>
						</SessionProvider>
					</ApiClientProvider>
					{/* 	</ThemeProvider> */}
				</NuqsAdapter>
				<Scripts />
			</body>
		</html>
	);
}
