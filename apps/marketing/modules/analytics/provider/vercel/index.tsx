declare global {
	interface Window {
		va?: (event: "event", name: string, data?: Record<string, unknown>) => void;
	}
}

export function AnalyticsScript() {
	return <script defer src="/_vercel/insights/script.js" />;
}

export function useAnalytics() {
	return {
		trackEvent: (event: string, data?: Record<string, unknown>) => {
			window.va?.("event", event, data);
		},
	};
}
