export function getSafeRedirectPath(value: string | undefined, fallback: string) {
	if (!value) {
		return fallback;
	}

	if (!value.startsWith("/") || value.startsWith("//")) {
		return fallback;
	}

	return value;
}
