import type { useTranslations } from "@i18n/intl";
import { Badge } from "@repo/ui/components/badge";
import { Skeleton } from "@repo/ui/components/skeleton";
import { DataGridColumnHeader } from "@repo/ui/components/reui/data-grid/data-grid-column-header";
import type { ColumnDef } from "@tanstack/react-table";
import { cn } from "@repo/ui";
import type { Branch } from "../../types";
import { BranchActions } from "./actions";

export function getColumns(
	t: ReturnType<typeof useTranslations>,
): ColumnDef<Branch>[] {
	return [
		{
			accessorKey: "name",
			id: "name",
			header: ({ column }) => (
				<DataGridColumnHeader
					title={t("columns.name")}
					column={column}
				/>
			),
			cell: ({ row }) => (
				<span className="text-muted-foreground">
					{row.original.name ?? "\u2014"}
				</span>
			),
			meta: {
				skeleton: <Skeleton className="h-5 w-32 " />,
			},
			enableSorting: true,
			enableHiding: false,
		},
		{
			accessorKey: "type",
			id: "type",
			header: ({ column }) => (
				<DataGridColumnHeader
					title={t("columns.type")}
					column={column}
				/>
			),
			cell: ({ row }) => (
				<Badge
					variant="outline"
					className={cn(
						row.original.type === "PHYSICAL"
							? "border-primary/20 bg-primary/10 text-primary"
							: "border-info/20 bg-info/10 text-info",
					)}
				>
					{t(`type.${row.original.type}`)}
				</Badge>
			),
			meta: {
				skeleton: <Skeleton className="h-5 w-16 rounded-full" />,
			},
			enableSorting: true,
			enableHiding: true,
		},
		{
			accessorKey: "status",
			id: "status",
			header: ({ column }) => (
				<DataGridColumnHeader
					title={t("columns.status")}
					column={column}
				/>
			),
			cell: ({ row }) => (
				<Badge
					variant="outline"
					className={cn(
						row.original.status === "ACTIVE"
							? "border-success/20 bg-success/10 text-success"
							: "border-warning/20 bg-warning/10 text-warning",
					)}
				>
					{t(`status.${row.original.status}`)}
				</Badge>
			),
			meta: {
				skeleton: <Skeleton className="h-5 w-16 rounded-full" />,
			},
			enableSorting: true,
			enableHiding: true,
		},
		{
			accessorKey: "city",
			id: "city",
			header: ({ column }) => (
				<DataGridColumnHeader
					title={t("columns.city")}
					column={column}
				/>
			),
			cell: ({ row }) => (
				<span className="text-muted-foreground">
					{row.original.city ?? "\u2014"}
				</span>
			),
			meta: {
				skeleton: <Skeleton className="h-5 w-20" />,
			},
			enableSorting: true,
			enableHiding: true,
		},
		{
			accessorKey: "phone",
			id: "phone",
			header: ({ column }) => (
				<DataGridColumnHeader
					title={t("columns.phone")}
					column={column}
				/>
			),
			cell: ({ row }) => (
				<span className="text-muted-foreground">
					{row.original.phone ?? "\u2014"}
				</span>
			),
			meta: {
				skeleton: <Skeleton className="h-5 w-24" />,
			},
			enableSorting: false,
			enableHiding: true,
		},
		{
			accessorKey: "email",
			id: "email",
			header: ({ column }) => (
				<DataGridColumnHeader
					title={t("columns.email")}
					column={column}
				/>
			),
			cell: ({ row }) => (
				<span className="text-muted-foreground">
					{row.original.email ?? "\u2014"}
				</span>
			),
			meta: {
				skeleton: <Skeleton className="h-5 w-36" />,
			},
			enableSorting: false,
			enableHiding: true,
		},
		{
			id: "actions",
			header: "",
			cell: ({ row }) => <BranchActions row={row} />,
			enableSorting: false,
			enableHiding: false,
		},
	];
}
