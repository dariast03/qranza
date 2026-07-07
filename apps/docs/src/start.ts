import { redirect } from "@tanstack/react-router";
import { createMiddleware, createStart } from "@tanstack/react-start";
import { isMarkdownPreferred, rewritePath } from "fumadocs-core/negotiation";

import { docsContentRoute, docsRoute } from "@/lib/shared";

const docsPathRewriter = rewritePath(
	`${docsRoute}{/*path}`,
	`${docsContentRoute}{/*path}/content.md`,
);
const suffixPathRewriter = rewritePath(
	`${docsRoute}{/*path}.mdx`,
	`${docsContentRoute}{/*path}/content.md`,
);
const rewriteDocs = (pathname: string) => docsPathRewriter.rewrite(pathname);
const rewriteSuffix = (pathname: string) => suffixPathRewriter.rewrite(pathname);

const llmMiddleware = createMiddleware().server(({ next, request }) => {
	const url = new URL(request.url);
	const path = rewriteSuffix(url.pathname);

	if (path) {
		throw redirect(new URL(path, url));
	}

	if (isMarkdownPreferred(request)) {
		const docsPath = rewriteDocs(url.pathname);
		if (docsPath) {
			throw redirect(new URL(docsPath, url));
		}
	}

	return next();
});

export const startInstance = createStart(() => {
	return {
		requestMiddleware: [llmMiddleware],
	};
});
