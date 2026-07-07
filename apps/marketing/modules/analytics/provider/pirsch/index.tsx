declare global {
	interface Window {
		pirsch?: (event: string, options?: { meta?: Record<string, unknown> }) => void;
	}
}

const pirschCode = import.meta.env.VITE_PIRSCH_CODE as string | undefined;

export function AnalyticsScript() {
	if (!pirschCode) {
		return null;
	}
	return (
		<script
			defer
			type="text/javascript"
			src="https://api.pirsch.io/pirsch-extended.js"
			id="pirschextendedjs"
			data-code={pirschCode}
		/>
	);
}

export function useAnalytics() {
	const trackEvent = (event: string, data?: Record<string, unknown>) => {
		if (typeof window === "undefined" || typeof window.pirsch !== "function") {
			return;
		}
		window.pirsch(event, { meta: data });
	};

	return { trackEvent };
}
