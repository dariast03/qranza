import { useMemo } from "react";
import { useTranslations } from "@i18n/intl";
import {
	DataGrid,
	DataGridContainer,
} from "@repo/ui/components/reui/data-grid/data-grid";
import { DataGridPagination } from "@repo/ui/components/reui/data-grid/data-grid-pagination";
import { DataGridScrollArea } from "@repo/ui/components/reui/data-grid/data-grid-scroll-area";
import { DataGridTable } from "@repo/ui/components/reui/data-grid/data-grid-table";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@repo/ui/components/input-group";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useTableSearchParams } from "tanstack-table-search-params";
import { Link } from "@tanstack/react-router";
import { Route } from "@routes/_authenticated/_main/app/settings/business/locations/index";
import { PlusIcon, SearchIcon, XIcon } from "lucide-react";
import { useBranches } from "../../../shared/hooks/use-branches";
import { getColumns } from "./columns";

export function BranchesTable() {
	const t = useTranslations("settings.branches");

	const navigate = Route.useNavigate();
	const query = Route.useSearch();

	const stateAndOnChanges = useTableSearchParams(
		{
			replace: (url) => {
				const searchParams = new URLSearchParams(url.split("?")[1]);
				navigate({
					search: Object.fromEntries(searchParams.entries()) as any,
					replace: true,
				});
			},
			query,
			pathname: Route.path,
		},
		{
			debounceMilliseconds: {
				globalFilter: 500,
			},
		},
	);

	const globalFilter = (stateAndOnChanges.state.globalFilter as string) ?? "";
	const sorting =
		(stateAndOnChanges.state.sorting as { id: string; desc: boolean }[]) ??
		[];
	const pageIndex =
		(stateAndOnChanges.state.pagination as { pageIndex: number })
			?.pageIndex ?? 0;
	const pageSize =
		(stateAndOnChanges.state.pagination as { pageSize: number })
			?.pageSize ?? 10;

	const { data: result, isLoading } = useBranches({
		pageIndex,
		pageSize,
		globalFilter,
		sorting,
	});

	const columns = useMemo(() => getColumns(t), [t]);

	const table = useReactTable({
		columns,
		data: result?.data ?? [],
		rowCount: result?.total ?? 0,
		getRowId: (row) => row.id,
		getCoreRowModel: getCoreRowModel(),
		manualPagination: true,
		manualSorting: true,
		...stateAndOnChanges,
	});

	return (
		<DataGrid
			table={table}
			recordCount={result?.total ?? 0}
			isLoading={isLoading}
			emptyMessage={t("empty")}
			tableLayout={{
				columnsVisibility: true,
			}}
		>
			<Card className="w-full gap-3 py-0">
				<CardHeader className="flex items-center justify-between px-3.5 py-2">
					<div className="flex items-center gap-2.5">
						<InputGroup className="w-64">
							<InputGroupAddon align="inline-start">
								<SearchIcon />
							</InputGroupAddon>
							<InputGroupInput
								placeholder={t("search")}
								value={globalFilter}
								onChange={(e) =>
									stateAndOnChanges.onGlobalFilterChange?.(
										e.target.value,
									)
								}
							/>
							{globalFilter.length > 0 && (
								<InputGroupAddon align="inline-end">
									<Button
										size="icon-xs"
										variant="ghost"
										onClick={() =>
											stateAndOnChanges.onGlobalFilterChange?.(
												"",
											)
										}
									>
										<XIcon />
									</Button>
								</InputGroupAddon>
							)}
						</InputGroup>
					</div>
					<Button
						render={
							<Link
								to="/app/settings/business/locations/new"
								from={Route.fullPath}
							/>
						}
					>
						<PlusIcon />
						{t("create")}
					</Button>
				</CardHeader>
				<CardContent className="p-0">
					<Card className="p-0">
						<DataGridContainer>
							<DataGridScrollArea>
								<DataGridTable />
							</DataGridScrollArea>
						</DataGridContainer>
					</Card>
				</CardContent>
				<CardFooter className="border-none bg-transparent! px-3.5 py-2">
					<DataGridPagination />
				</CardFooter>
			</Card>
		</DataGrid>
	);
}
