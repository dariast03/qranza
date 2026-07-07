import { getCurrentLocale } from "./runtime";
import {
	defaultLocale,
	extractLocaleFromPath,
	normalizeLocale,
	shouldIgnorePath,
	stripLocaleFromPath,
} from "./shared";

function copyUrl(url: URL | string): URL {
	return new URL(url.toString());
}

function withPathname(url: URL, pathname: string): URL {
	const nextUrl = copyUrl(url);
	nextUrl.pathname = pathname;
	return nextUrl;
}

export function deLocalizeUrl(url: URL): URL {
	if (shouldIgnorePath(url.pathname)) {
		return url;
	}

	const locale = extractLocaleFromPath(url.pathname);
	if (!locale) {
		return url;
	}

	return withPathname(url, stripLocaleFromPath(url.pathname));
}

export function localizeUrl(url: URL | string, options?: { locale?: string }): URL {
	const nextUrl = copyUrl(url);

	if (shouldIgnorePath(nextUrl.pathname)) {
		return nextUrl;
	}

	const locale = normalizeLocale(options?.locale ?? getCurrentLocale());
	const delocalizedPathname = stripLocaleFromPath(nextUrl.pathname);

	if (locale === defaultLocale) {
		nextUrl.pathname = delocalizedPathname;
		return nextUrl;
	}

	nextUrl.pathname = `/${locale}${delocalizedPathname === "/" ? "" : delocalizedPathname}`;
	return nextUrl;
}

export function deLocalizeHref(href: string): string {
	const url = new URL(href, "http://localhost");
	const delocalized = deLocalizeUrl(url);
	return `${delocalized.pathname}${delocalized.search}${delocalized.hash}`;
}

export function localizeHref(href: string, options?: { locale?: string }): string {
	const url = new URL(href, "http://localhost");
	const localized = localizeUrl(url, options);
	return `${localized.pathname}${localized.search}${localized.hash}`;
}
