/**
 * Pluck a human-readable root-level error message out of a TanStack Form
 * `formState.errors` array. Forms use this to show banner-style Alerts when a
 * submission handler sets `errorMap.onSubmit.form = "..."`.
 */
export function formatFormRootError(errors: unknown[]): string | undefined {
	for (const e of errors) {
		if (typeof e === "string") {
			return e;
		}
		if (e && typeof e === "object") {
			const record = e as Record<string, unknown>;
			if (typeof record.form === "string") {
				return record.form;
			}
			if (typeof record.message === "string") {
				return record.message;
			}
		}
	}
	return undefined;
}
