import path from "node:path";
import { fileURLToPath } from "node:url";

import contentCollections from "@content-collections/vite";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig, loadEnv } from "vite";

const marketingRoot = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.resolve(marketingRoot, "../..");

export default defineConfig(({ mode }) => {
	Object.assign(process.env, loadEnv(mode, monorepoRoot, ""));

	return {
		envDir: monorepoRoot,
		envPrefix: ["VITE_"],
		environments: {
			ssr: {
				build: {
					rollupOptions: {
						input: "./src/server.ts",
					},
				},
			},
		},
		server: {
			port: Number.parseInt(process.env.PORT ?? "3001", 10),
			fs: { allow: [monorepoRoot] },
		},
		plugins: [
			contentCollections(),
			tanstackStart({
				srcDirectory: ".",
			}),
			viteReact(),
			tailwindcss(),
			nitro({
				traceDeps: ["react", "react-dom"],
			}),
		],
		resolve: {
			dedupe: ["react", "react-dom"],
			tsconfigPaths: true,
		},
	};
});
