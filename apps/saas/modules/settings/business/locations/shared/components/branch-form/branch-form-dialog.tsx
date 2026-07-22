import { useTranslations } from "@i18n/intl";
import { Button } from "@repo/ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@repo/ui/components/dialog";

import type { Branch } from "../../types/branch";
import { BranchForm } from "./branch-form";

export interface BranchFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	branch?: Branch;
	isLoadingBranch?: boolean;
	/**
	 * Optional override for the dialog title. Defaults to a localized
	 * "create location" / "edit location" string.
	 */
	title?: string;
	/**
	 * Optional override for the dialog description.
	 */
	description?: string;
	/**
	 * Trigger element. The dialog opens when the trigger is clicked.
	 * When `open` is controlled the trigger is optional.
	 */
	trigger?: React.ReactNode;
}

export function BranchFormDialog({
	open,
	onOpenChange,
	branch,
	isLoadingBranch,
	title,
	description,
	trigger,
}: BranchFormDialogProps) {
	const t = useTranslations("settings.branches.form");
	const tCommon = useTranslations();
	const isEdit = Boolean(branch);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			{trigger}
			<DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{title ?? t(isEdit ? "editTitle" : "createTitle")}
					</DialogTitle>
					{description !== undefined && (
						<DialogDescription>{description}</DialogDescription>
					)}
				</DialogHeader>

				<BranchForm
					branch={branch}
					isLoadingBranch={isLoadingBranch}
					hideFooter
					onSuccess={() => onOpenChange(false)}
					onCancel={() => onOpenChange(false)}
					renderSubmit={({ submit, isSubmitting, canSubmit }) => (
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
							>
								{tCommon("common.confirmation.cancel")}
							</Button>
							<Button
								type="button"
								onClick={submit}
								loading={isSubmitting}
								disabled={!canSubmit}
							>
								{t(isEdit ? "actions.save" : "actions.create")}
							</Button>
						</DialogFooter>
					)}
				/>
			</DialogContent>
		</Dialog>
	);
}
