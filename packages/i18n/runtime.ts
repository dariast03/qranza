import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import type { Locale } from "./config";
import { defaultLocale, parseLocaleCookie, resolveLocaleFromPathname } from "./shared";

export const getCurrentLocale = createIsomorphicFn()
	.server((): Locale => {
		const request = getRequest();
		if (!request) {
			return defaultLocale;
		}

		const url = new URL(request.url);
		return resolveLocaleFromPathname(url.pathname, request.headers.get("cookie"));
	})
	.client((): Locale => {
		if (typeof window === "undefined") {
			return defaultLocale;
		}

		return resolveLocaleFromPathname(window.location.pathname, document.cookie);
	});

export function getClientLocale(pathname = window.location.pathname): Locale {
	if (typeof document === "undefined") {
		return defaultLocale;
	}

	return resolveLocaleFromPathname(pathname, document.cookie);
}

export function getCookieLocale(cookieHeader: string | null | undefined): Locale {
	return parseLocaleCookie(cookieHeader) ?? defaultLocale;
}
