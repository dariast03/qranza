import { auth } from "@repo/auth";
import { logger } from "@repo/logs";
import { webhookHandler as paymentsWebhookHandler } from "@repo/payments";
import { getTrustedOrigins } from "@repo/utils";
import { Hono } from "hono";
import type { MiddlewareHandler } from "hono";
import { cors } from "hono/cors";
import { logger as honoLogger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

import { openApiHandler, rpcHandler } from "./orpc/handler";

export { router } from "./orpc/router";

const allowedOrigins = getTrustedOrigins();
const isProduction = process.env.NODE_ENV === "production";
const enableApiDocs = process.env.ENABLE_API_DOCS === "true" || !isProduction;

function createRateLimiter({
	windowMs,
	max,
}: {
	windowMs: number;
	max: number;
}): MiddlewareHandler {
	const hits = new Map<string, { count: number; resetAt: number }>();

	return async (c, next) => {
		const now = Date.now();
		const forwardedFor = c.req.header("x-forwarded-for")?.split(",")[0]?.trim();
		const key = c.req.header("cf-connecting-ip") ?? forwardedFor ?? "anonymous";
		const current = hits.get(key);

		if (!current || current.resetAt <= now) {
			hits.set(key, { count: 1, resetAt: now + windowMs });
			await next();
			return;
		}

		if (current.count >= max) {
			return c.text("Too many requests", 429, {
				"Retry-After": Math.ceil((current.resetAt - now) / 1000).toString(),
			});
		}

		current.count += 1;
		await next();
	};
}

const authRateLimit = createRateLimiter({ windowMs: 60_000, max: 20 });
const apiRateLimit = createRateLimiter({ windowMs: 60_000, max: 120 });

export const app = new Hono()
	.basePath("/api")
	// Security headers — a reasonable default for API responses. Apps that
	// need a stricter CSP can extend this stack.
	.use(
		secureHeaders({
			strictTransportSecurity: isProduction
				? "max-age=63072000; includeSubDomains; preload"
				: false,
			xFrameOptions: "DENY",
			xContentTypeOptions: "nosniff",
			referrerPolicy: "strict-origin-when-cross-origin",
			crossOriginResourcePolicy: "same-site",
		}),
	)
	// Request logger
	.use(honoLogger((message, ...rest) => logger.log(message, ...rest)))
	.use("/auth/*", authRateLimit)
	.use("/rpc/*", apiRateLimit)
	.use("/webhooks/payments", apiRateLimit)
	// CORS: allow the SaaS app and (optionally) the marketing site.
	.use(
		cors({
			origin: allowedOrigins,
			allowHeaders: ["Content-Type", "Authorization"],
			allowMethods: ["POST", "GET", "OPTIONS"],
			exposeHeaders: ["Content-Length"],
			maxAge: 600,
			credentials: true,
		}),
	)
	// Better Auth handler
	.on(["POST", "GET"], "/auth/**", (c) => auth.handler(c.req.raw))
	// Payments webhook handler
	.post("/webhooks/payments", (c) => paymentsWebhookHandler(c.req.raw))
	// Health probe
	.get("/health", (c) => c.text("OK"))
	// oRPC handlers (both RPC and OpenAPI)
	.use("*", async (c, next) => {
		if (!enableApiDocs && c.req.path.startsWith("/api/docs")) {
			return c.notFound();
		}

		const context = {
			headers: c.req.raw.headers,
		};

		const isRpc = c.req.path.includes("/rpc/");
		const handler = isRpc ? rpcHandler : openApiHandler;
		const prefix = isRpc ? "/api/rpc" : "/api";

		const { matched, response } = await handler.handle(c.req.raw, {
			prefix,
			context,
		});

		if (matched) {
			return c.newResponse(response.body, response);
		}

		await next();
	});
