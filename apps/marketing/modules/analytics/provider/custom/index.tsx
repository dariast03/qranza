export function AnalyticsScript() {
	return null;
}

export function useAnalytics() {
	return {
		trackEvent: (_event: string, _data?: Record<string, unknown>) => {
			/* Add your custom analytics integration here. */
		},
	};
}
