import { useTranslations } from "@i18n/intl";
import { PageHeader } from "@shared/components/PageHeader";
import { BranchesTable } from "../components/table";

export function LocationsPage() {
	const t = useTranslations("settings.branches");

	return (
		<div>
			<PageHeader title={t("title")} subtitle={t("description")} />
			<BranchesTable />
		</div>
	);
}
