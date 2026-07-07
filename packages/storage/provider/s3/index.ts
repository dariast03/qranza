import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl as getS3SignedUrl } from "@aws-sdk/s3-request-presigner";
import { logger } from "@repo/logs";

import { config } from "../../config";
import type { GetSignedUploadUrlHandler, GetSignedUrlHander } from "../../types";

let s3Client: S3Client | null = null;

const getS3Client = () => {
	if (s3Client) {
		return s3Client;
	}

	const s3Endpoint = process.env.S3_ENDPOINT;
	if (!s3Endpoint) {
		throw new Error("Missing env variable S3_ENDPOINT");
	}

	const s3AccessKeyId = process.env.S3_ACCESS_KEY_ID;
	if (!s3AccessKeyId) {
		throw new Error("Missing env variable S3_ACCESS_KEY_ID");
	}

	const s3SecretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
	if (!s3SecretAccessKey) {
		throw new Error("Missing env variable S3_SECRET_ACCESS_KEY");
	}

	// `"auto"` is what Cloudflare R2 expects; AWS S3 requires an explicit
	// region and will reject requests with region=auto. Callers should set
	// `S3_REGION` explicitly when running against AWS.
	const s3Region = process.env.S3_REGION ?? "auto";

	s3Client = new S3Client({
		region: s3Region,
		endpoint: s3Endpoint,
		forcePathStyle: true,
		credentials: {
			accessKeyId: s3AccessKeyId,
			secretAccessKey: s3SecretAccessKey,
		},
	});

	return s3Client;
};

const CONTENT_TYPE_BY_EXTENSION: Record<string, string> = {
	png: "image/png",
	jpg: "image/jpeg",
	jpeg: "image/jpeg",
	gif: "image/gif",
	webp: "image/webp",
	svg: "image/svg+xml",
};

function getContentTypeFromPath(path: string): string {
	const ext = path.split(".").pop()?.toLowerCase() ?? "";
	return CONTENT_TYPE_BY_EXTENSION[ext] ?? "application/octet-stream";
}

export const getSignedUploadUrl: GetSignedUploadUrlHandler = async (path, { bucket }) => {
	const bucketName = config.bucketNames[bucket];
	const s3Client = getS3Client();
	const contentType = getContentTypeFromPath(path);

	try {
		// Pinning Content-Type in the presigned URL means S3 rejects uploads
		// whose MIME type doesn't match, which prevents callers from smuggling
		// non-image content past our extension-based checks. Callers MUST set
		// the `Content-Type` header on the PUT request to this exact value.
		//
		// For per-bucket size caps, configure an S3 bucket policy with a
		// `s3:content-length-range` condition or use a presigned POST
		// (presigned PUT URLs cannot bind an arbitrary max length).
		return await getS3SignedUrl(
			s3Client,
			new PutObjectCommand({
				Bucket: bucketName,
				Key: path,
				ContentType: contentType,
			}),
			{
				expiresIn: 300,
				signableHeaders: new Set(["content-type"]),
			},
		);
	} catch (e) {
		logger.error(e);

		throw new Error("Could not get signed upload url");
	}
};

export const getSignedUrl: GetSignedUrlHander = async (path, { bucket, expiresIn }) => {
	const bucketName = config.bucketNames[bucket];

	if (!bucketName) {
		throw new Error("Invalid bucket");
	}

	const s3Client = getS3Client();
	try {
		return getS3SignedUrl(s3Client, new GetObjectCommand({ Bucket: bucketName, Key: path }), {
			expiresIn,
		});
	} catch (e) {
		logger.error(e);
		throw new Error("Could not get signed url");
	}
};
