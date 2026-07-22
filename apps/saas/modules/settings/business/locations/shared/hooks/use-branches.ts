import { orpc } from "@shared/lib/orpc-query-utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type BranchListParams = {
	pageIndex: number;
	pageSize: number;
	globalFilter: string;
	sorting: { id: string; desc: boolean }[];
};

export function useBranches(params: BranchListParams) {
	return useQuery(
		orpc.branches.list.queryOptions({
			input: {
				limit: params.pageSize,
				offset: params.pageIndex * params.pageSize,
				query: params.globalFilter || undefined,
				sort: params.sorting.length
					? { field: params.sorting[0].id as "name" | "type" | "status" | "city" | "createdAt", direction: params.sorting[0].desc ? "desc" : "asc" }
					: { field: "name", direction: "asc" },
			},
		}),
	);
}

export function useBranch(id: string) {
	return useQuery(orpc.branches.get.queryOptions({ input: { id } }));
}

export function useCreateBranch() {
	const queryClient = useQueryClient();

	return useMutation(
		orpc.branches.create.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: orpc.branches.key(),
				});
			},
		}),
	);
}

export function useUpdateBranch() {
	const queryClient = useQueryClient();

	return useMutation(
		orpc.branches.update.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: orpc.branches.key(),
				});
			},
		}),
	);
}

export function useDeleteBranch() {
	const queryClient = useQueryClient();

	return useMutation(
		orpc.branches.delete.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: orpc.branches.key(),
				});
			},
		}),
	);
}

export function useRestoreBranch() {
	const queryClient = useQueryClient();

	return useMutation(
		orpc.branches.restore.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: orpc.branches.key(),
				});
			},
		}),
	);
}
