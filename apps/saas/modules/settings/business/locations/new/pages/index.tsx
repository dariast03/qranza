import { useTranslations } from "@i18n/intl";
import { BranchFormPage } from "@settings/business/locations/shared";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";

export function NewBranchPage() {
	const t = useTranslations("settings.branches.notifications");
	const navigate = useNavigate();

	useEffect(() => {
		document.title = t("created");
	}, [t]);

	return (
		<BranchFormPage
			onSaved={(branch) => {
				navigate({
					to: "/app/settings/business/locations/$branchId",
					params: { branchId: branch.id },
					replace: true,
				});
				toast.success(t("created"));
			}}
		/>
	);
}
