import type { I18nConfig } from "./types";

export const config = {
	locales: {
		en: {
			label: "English",
			currency: "USD",
		},
		es: {
			label: "Español",
			currency: "USD",
		},
	},
	defaultLocale: "en",
	defaultCurrency: "USD",
	localeCookieName: "locale",
} as const satisfies I18nConfig;

export type Locale = keyof typeof config.locales;
