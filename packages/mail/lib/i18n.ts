import { createTranslatorForLocale, type Locale } from "@repo/i18n";

export function getMailTranslator(locale: Locale) {
	return createTranslatorForLocale(locale, "mail");
}
