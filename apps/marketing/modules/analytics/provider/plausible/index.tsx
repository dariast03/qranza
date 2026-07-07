declare global {
	interface Window {
		plausible?: (event: string, options?: { props?: Record<string, unknown> }) => void;
	}
}

const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_URL as string | undefined;

export function AnalyticsScript() {
	if (!plausibleDomain) {
		return null;
	}
	return (
		<script
			defer
			type="text/javascript"
			data-domain={plausibleDomain}
			src="https://plausible.io/js/script.js"
		/>
	);
}

export function useAnalytics() {
	const trackEvent = (event: string, data?: Record<string, unknown>) => {
		if (typeof window === "undefined" || typeof window.plausible !== "function") {
			return;
		}
		window.plausible(event, { props: data });
	};

	return { trackEvent };
}
