import { getBaseUrl as getBaseUrlFromUtils } from "@repo/utils";

/**
 * Resolves the public-facing URL of the marketing site.
 *
 * Prefers the compile-time `VITE_MARKETING_URL` (Vite rewrites
 * `import.meta.env.*` at build time for client code). Falls back to
 * `process.env.VITE_MARKETING_URL` so server-side code still resolves
 * correctly, and finally to `http://localhost:PORT`.
 */
export function getBaseUrl() {
	const fromClient =
		typeof import.meta !== "undefined" && import.meta.env
			? (import.meta.env.VITE_MARKETING_URL as string | undefined)
			: undefined;
	const fromServer = typeof process !== "undefined" ? process.env.VITE_MARKETING_URL : undefined;
	return getBaseUrlFromUtils(fromClient ?? fromServer, 3001);
}
