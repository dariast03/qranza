import { Link } from "@tanstack/react-router";

import { Button } from "@repo/ui/components/button";

export function NotFound() {
	return (
		<div className="flex h-dvh flex-col items-center justify-center space-y-2 text-center">
			<h1 className="font-semibold text-2xl">Page not found.</h1>
			<p className="text-muted-foreground">
				The page you are looking for could not be found.
			</p>
			<Button
				nativeButton={false}
				variant="outline"
				/* TODO: REMOVE */
				/*@ts-ignore  */
				render={<Link to="/dashboard/default" replace />}
			>
				Go back home
			</Button>
		</div>
	);
}
