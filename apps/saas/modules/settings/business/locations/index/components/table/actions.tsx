import { useTranslations } from "@i18n/intl";
import { Button } from "@repo/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from "lucide-react";
import type { Branch } from "../../types";
import { Row } from "@tanstack/react-table";
import { useConfirm } from "@omit/react-confirm-dialog";
import { Link } from "@tanstack/react-router";
import { useDeleteBranch } from "../../../shared/hooks/use-branches";

interface BranchActionsProps {
	row: Row<Branch>;
}

export function BranchActions({ row }: BranchActionsProps) {
	const t = useTranslations("settings.branches");
	const confirm = useConfirm();
	const deleteBranch = useDeleteBranch();

	const handleDelete = async () => {
		const confirmed = await confirm({
			title: t("delete"),
			description: <span>{t("confirmDelete.message")}</span>,
			cancelText: t("common.confirmation.cancel"),
			confirmText: t("delete"),
			media: <Trash2Icon />,
			cancelButton: {
				variant: "outline",
			},
			confirmButton: {
				variant: "destructive",
			},
			alertDialogMedia: {
				className:
					"bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive",
			},
		});

		if (confirmed) {
			await deleteBranch.mutateAsync({ id: row.original.id });
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button className="size-7" size="icon" variant="ghost">
						<MoreHorizontalIcon />
					</Button>
				}
			/>
			<DropdownMenuContent side="bottom" align="start">
				<DropdownMenuItem render={
					<Link
						to="/app/settings/business/locations/$branchId"
						params={{ branchId: row.original.id }}
					/>
				}>
					<PencilIcon />
					{t("edit")}
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					variant="destructive"
					onClick={handleDelete}
					disabled={deleteBranch.isPending}
				>
					<Trash2Icon />
					{t("delete")}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
