declare global {
	interface Window {
		umami?: {
			track: (event: string, data?: Record<string, unknown>) => void;
		};
	}
}

const umamiWebsiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID as string | undefined;
const umamiSrc =
	(import.meta.env.VITE_UMAMI_SRC as string | undefined) ??
	"https://analytics.eu.umami.is/script.js";

export function AnalyticsScript() {
	if (!umamiWebsiteId) {
		return null;
	}
	return <script async type="text/javascript" data-website-id={umamiWebsiteId} src={umamiSrc} />;
}

export function useAnalytics() {
	const trackEvent = (event: string, data?: Record<string, unknown>) => {
		if (typeof window === "undefined" || !window.umami) {
			return;
		}
		window.umami.track(event, data);
	};

	return { trackEvent };
}
