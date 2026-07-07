import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { getBaseUrl } from "./base-url";

describe("getBaseUrl (saas)", () => {
	const originalEnv = process.env;

	beforeEach(() => {
		process.env = { ...originalEnv };
		delete process.env.VITE_SAAS_URL;
		delete process.env.PORT;
	});

	afterEach(() => {
		process.env = originalEnv;
	});

	it("returns the VITE_SAAS_URL when set", () => {
		process.env.VITE_SAAS_URL = "https://app.example.com";
		expect(getBaseUrl()).toBe("https://app.example.com");
	});

	it("falls back to localhost on the default port", () => {
		expect(getBaseUrl()).toBe("http://localhost:3000");
	});

	it("uses PORT env when provided and no VITE_SAAS_URL is set", () => {
		process.env.PORT = "4000";
		expect(getBaseUrl()).toBe("http://localhost:4000");
	});
});
