import type { Locale } from "./config";
import {
	createLocaleCookieHeader,
	defaultLocale,
	extractLocaleFromPath,
	localeCookieName,
	parseLocaleCookie,
	shouldIgnorePath,
	stripLocaleFromPath,
} from "./shared";

interface LocaleMiddlewareResult {
	redirect?: Response;
	setCookie?: {
		name: string;
		value: Locale;
	};
}

export function handleLocaleMiddleware(request: Request): LocaleMiddlewareResult {
	const url = new URL(request.url);
	const pathname = url.pathname;

	if (shouldIgnorePath(pathname)) {
		return {};
	}

	const locale = extractLocaleFromPath(pathname);

	if (locale === defaultLocale) {
		url.pathname = stripLocaleFromPath(pathname);
		return { redirect: Response.redirect(url.toString(), 301) };
	}

	if (!locale) {
		return {};
	}

	const strippedPathname = stripLocaleFromPath(pathname);
	if (shouldIgnorePath(strippedPathname)) {
		url.pathname = strippedPathname;
		return { redirect: Response.redirect(url.toString(), 301) };
	}

	const cookieLocale = parseLocaleCookie(request.headers.get("cookie"));
	if (cookieLocale !== locale) {
		return {
			setCookie: {
				name: localeCookieName,
				value: locale,
			},
		};
	}

	return {};
}

export { createLocaleCookieHeader };
