import type { MarketingConfig } from "./types";

export const config = {
	appName: "supastarter for Tanstack Start Demo",
	docsUrl: import.meta.env.VITE_DOCS_URL as string | undefined,
	saasUrl: import.meta.env.VITE_SAAS_URL as string | undefined,
	enabledThemes: ["light", "dark"],
	defaultTheme: "light",
} as const satisfies MarketingConfig;
