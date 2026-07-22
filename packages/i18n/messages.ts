import { toMerged } from "es-toolkit";
import { createTranslator } from "use-intl/core";

import { config, type Locale } from "./config";
import type { TranslationScope } from "./lib/get-messages";
import { normalizeLocale } from "./shared";
import enMail from "./translations/en/mail.json";
import enMarketing from "./translations/en/marketing.json";
import enSaas from "./translations/en/saas.json";
import enShared from "./translations/en/shared.json";
import esMail from "./translations/es/mail.json";
import esMarketing from "./translations/es/marketing.json";
import esSaas from "./translations/es/saas.json";
import esShared from "./translations/es/shared.json";

type Messages = Record<string, unknown>;

const scopedMessages = {
	en: {
		mail: enMail,
		marketing: enMarketing,
		saas: enSaas,
		shared: enShared,
	},
	es: {
		mail: esMail,
		marketing: esMarketing,
		saas: esSaas,
		shared: esShared,
	},
} as const satisfies Record<Locale, Record<TranslationScope | "shared", Messages>>;

function mergeScope(locale: Locale, scope: TranslationScope): Messages {
	const localeMessages = scopedMessages[locale][scope];
	const sharedMessages = scopedMessages[locale].shared;
	let messages = toMerged(localeMessages, sharedMessages) as Messages;

	if (locale !== config.defaultLocale) {
		const defaultLocale = config.defaultLocale;
		const defaultMessages = toMerged(
			scopedMessages[defaultLocale][scope],
			scopedMessages[defaultLocale].shared,
		) as Messages;
		messages = toMerged(defaultMessages, messages) as Messages;
	}

	return messages;
}

export function getMessagesForLocaleSync<T = Messages>(locale: string, scope: TranslationScope): T {
	return mergeScope(normalizeLocale(locale), scope) as T;
}

export function createTranslatorForLocale(locale: string, scope: TranslationScope) {
	const resolvedLocale = normalizeLocale(locale);
	const translator = createTranslator({
		locale: resolvedLocale,
		messages: getMessagesForLocaleSync(resolvedLocale, scope),
	});

	return (key: string, values?: Record<string, unknown>) =>
		translator(key as never, values as never) as string;
}
