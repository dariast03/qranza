import { createFileRoute } from "@tanstack/react-router";

import { Roles } from "./-components/roles";
import { roles } from "./-components/roles-table/data";

export const Route = createFileRoute("/_authenticated/_main/dashboard/roles")({
  component: Page,
});

function Page() {
  return <Roles roles={roles} />;
}
