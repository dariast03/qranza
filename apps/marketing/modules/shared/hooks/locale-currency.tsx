import { config } from "@i18n/config";
import { getCurrentLocale } from "@repo/i18n/runtime";

export function useLocaleCurrency() {
	const locale = getCurrentLocale();
	const localeCurrency =
		Object.entries(config.locales).find(([key]) => key === locale)?.[1].currency ??
		config.defaultCurrency;

	return localeCurrency;
}
