import { PricingTable } from "@payments/components/PricingTable";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/choose-plan/")({
	component: ChoosePlanPage,
	head: () => ({
		meta: [{ title: "Choose plan" }],
	}),
});

function ChoosePlanPage() {
	return (
		<div className="max-w-5xl p-6 mx-auto">
			<PricingTable />
		</div>
	);
}
