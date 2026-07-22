import { useTranslations } from "@i18n/intl";
import { Button } from "@repo/ui/components/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/card";
import { PageHeader } from "@shared/components/PageHeader";
import { Link } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";

import type { Branch } from "../../types/branch";
import { BranchForm } from "./branch-form";

export interface BranchFormPageProps {
	branch?: Branch;
	isLoadingBranch?: boolean;
	/**
	 * When provided, renders a "back" link/button in the page header.
	 * Defaults to the locations index.
	 */
	backHref?: string;
	/**
	 * When provided, overrides the default navigation after a successful save.
	 * Receives the persisted branch and should perform the navigation.
	 */
	onSaved?: (branch: Branch) => void;
}

export function BranchFormPage({
	branch,
	isLoadingBranch,
	backHref = "/app/settings/business/locations",
	onSaved,
}: BranchFormPageProps) {
	const t = useTranslations("settings.branches");
	const tForm = useTranslations("settings.branches.form");
	const isEdit = Boolean(branch);

	return (
		<div className="gap-6 flex flex-col">
			<div className="flex items-center gap-2">
				<Button
					variant="ghost"
					size="sm"
					render={<Link to={backHref} />}
					nativeButton={false}
				>
					<ArrowLeftIcon />
					{t("actions.back")}
				</Button>
			</div>

			<PageHeader
				title={tForm(isEdit ? "editTitle" : "createTitle")}
				subtitle={tForm(isEdit ? "editSubtitle" : "createSubtitle")}
			/>

			<Card>
				<CardHeader>
					<CardTitle>{t("sections.details")}</CardTitle>
				</CardHeader>
				<CardContent>
					<BranchForm
						branch={branch}
						isLoadingBranch={isLoadingBranch}
						onSuccess={(result) => {
							if (onSaved) {
								onSaved(result);
							}
						}}
						submitLabel="Guardar"
					/>
				</CardContent>
			</Card>
		</div>
	);
}
