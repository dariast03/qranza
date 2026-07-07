import { createLocaleCookieHeader, handleLocaleMiddleware } from "@repo/i18n/server";
import type { Register } from "@tanstack/react-router";
import {
	createStartHandler,
	defaultStreamHandler,
	type RequestOptions,
} from "@tanstack/react-start/server";
import { createServerEntry } from "@tanstack/react-start/server-entry";
import { fetchViteEnv } from "nitro/vite/runtime";

const handler = createStartHandler(defaultStreamHandler);

// Nitro runs this entry in its own vite environment, where TanStack Start's
// server-function resolver is not wired up. Forward the first pass into the
// ssr environment (marked via header to avoid an infinite loop) and only run
// the actual handler there.
const SSR_DISPATCH_HEADER = "x-ssr-dispatch";

export default createServerEntry({
	async fetch(req: Request, opts?: RequestOptions<Register>) {
		if (!req.headers.get(SSR_DISPATCH_HEADER)) {
			const headers = new Headers(req.headers);
			headers.set(SSR_DISPATCH_HEADER, "1");
			return fetchViteEnv(
				"ssr",
				new Request(req.url, {
					method: req.method,
					headers,
					body: req.body,
					// @ts-expect-error -- required by undici for streaming bodies
					duplex: "half",
					signal: req.signal,
				}),
			);
		}

		const { redirect, setCookie } = handleLocaleMiddleware(req);

		if (redirect) {
			return redirect;
		}

		const response = await handler(req, opts);

		if (setCookie) {
			response.headers.append("Set-Cookie", createLocaleCookieHeader(setCookie.value));
		}

		return response;
	},
});
