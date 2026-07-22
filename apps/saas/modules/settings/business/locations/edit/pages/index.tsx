import { useTranslations } from "@i18n/intl";
import { BranchFormPage, useBranch } from "@settings/business/locations/shared";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";

export interface EditBranchPageProps {
	branchId: string;
}

export function EditBranchPage({ branchId }: EditBranchPageProps) {
	const t = useTranslations("settings.branches.notifications");
	const navigate = useNavigate();
	const { data: branch, isLoading } = useBranch(branchId);

	useEffect(() => {
		document.title = t("updated");
	}, [t]);

	return (
		<BranchFormPage
			branch={branch ?? undefined}
			isLoadingBranch={isLoading}
			onSaved={(saved) => {
				if (saved.id !== branchId) {
					navigate({
						to: "/app/settings/business/locations/$branchId",
						params: { branchId: saved.id },
						replace: true,
					});
				}

				toast.success(t("updated"));
			}}
		/>
	);
}
