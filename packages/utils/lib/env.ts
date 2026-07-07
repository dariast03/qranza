import type { z } from "zod";

/**
 * Parses and validates a subset of `process.env` against a zod schema at
 * import-time, failing fast with a readable error if required variables are
 * missing or malformed.
 *
 * @example
 * ```ts
 * import { z } from "zod";
 * import { parseEnv } from "@repo/utils";
 *
 * const envSchema = z.object({
 *   DATABASE_URL: z.string().url(),
 *   BETTER_AUTH_SECRET: z.string().min(32),
 * });
 *
 * export const env = parseEnv(envSchema);
 * ```
 */
export function parseEnv<Schema extends z.ZodType<Record<string, unknown>>>(
	schema: Schema,
	source: Record<string, string | undefined> = process.env,
): z.infer<Schema> {
	const parsed = schema.safeParse(source);
	if (!parsed.success) {
		const formatted = parsed.error.issues
			.map((issue) => `  • ${issue.path.join(".") || "(root)"}: ${issue.message}`)
			.join("\n");
		const message = `Invalid environment variables:\n${formatted}`;
		// Logging and throwing so the error is visible even in the few execution
		// environments that swallow uncaught-rejections (edge runtimes etc.).
		// eslint-disable-next-line no-console
		console.error(message);
		throw new Error(message);
	}
	return parsed.data;
}
