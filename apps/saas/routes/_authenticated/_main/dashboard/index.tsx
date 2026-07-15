import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/dashboard/")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard/default", replace: true });
  },
});
