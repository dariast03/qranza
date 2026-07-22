import { useTranslations } from "@i18n/intl";
import { Button } from "@repo/ui/components/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@repo/ui/components/sheet";

import type { Branch } from "../../types/branch";
import { BranchForm } from "./branch-form";

export interface BranchFormSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	branch?: Branch;
	isLoadingBranch?: boolean;
	side?: "top" | "right" | "bottom" | "left";
	title?: string;
	description?: string;
	trigger?: React.ReactNode;
}

export function BranchFormSheet({
	open,
	onOpenChange,
	branch,
	isLoadingBranch,
	side = "right",
	title,
	description,
	trigger,
}: BranchFormSheetProps) {
	const t = useTranslations("settings.branches.form");
	const tCommon = useTranslations();
	const isEdit = Boolean(branch);

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			{trigger}
			<SheetContent
				side={side}
				className="sm:max-w-xl gap-0 p-0 flex flex-col h-full"
			>
				<SheetHeader className="p-6 pb-2">
					<SheetTitle>
						{title ?? t(isEdit ? "editTitle" : "createTitle")}
					</SheetTitle>
					{description !== undefined && (
						<SheetDescription>{description}</SheetDescription>
					)}
				</SheetHeader>

				<div className="flex-1 overflow-y-auto px-6">
					<BranchForm
						id="branch-form-sheet"
						branch={branch}
						isLoadingBranch={isLoadingBranch}
						hideFooter
						className="pb-6"
					/>
				</div>

				<SheetFooter className="border-t p-4">
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						{tCommon("common.confirmation.cancel")}
					</Button>
					<Button
						type="submit"
						form="branch-form-sheet"
					>
						{t(isEdit ? "actions.save" : "actions.create")}
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
