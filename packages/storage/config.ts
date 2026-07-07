import type { StorageConfig } from "./types";

export const config = {
	bucketNames: {
		avatars: process.env.VITE_AVATARS_BUCKET_NAME ?? "avatars",
	},
} as const satisfies StorageConfig;
