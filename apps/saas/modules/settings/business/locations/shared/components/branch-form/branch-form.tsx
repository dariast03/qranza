import { useTranslations } from "@i18n/intl";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/alert";
import { Button } from "@repo/ui/components/button";
import { formatFormRootError } from "@repo/ui/components/form-root-error";
import { FieldGroup, FieldLegend, FieldSet } from "@repo/ui/components/field";
import { Spinner } from "@repo/ui/components/spinner";
import { orpc } from "@shared/lib/orpc-query-utils";
import { useSelector } from "@tanstack/react-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TriangleAlertIcon } from "lucide-react";
import { useMemo } from "react";

import {
	branchToFormValues,
	formValuesToCreateInput,
	formValuesToUpdateInput,
	getEmptyBranchFormValues,
} from "../../lib/branch-defaults";
import {
	branchFormSchema,
	type BranchFormValues,
} from "../../lib/branch-schema";
import type { Branch } from "../../types/branch";
import {
	BranchBasicFields,
	BranchBrandingFields,
	BranchContactFields,
	BranchScheduleFields,
} from "./sections";
import { useBlocker } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";

export interface BranchFormProps {
	/**
	 * When provided the form runs in edit mode (PATCH /branches/{id}).
	 * When omitted the form runs in create mode (POST /branches).
	 */
	branch?: Branch;
	/**
	 * Whether the form data is still loading. While true the submit button is
	 * disabled and a spinner is rendered. Mostly relevant in edit mode.
	 */
	isLoadingBranch?: boolean;
	/**
	 * Called after a successful create or update. The form does not navigate
	 * on its own — consumers decide what to do (close a dialog, redirect,
	 * refresh a list, etc.).
	 */
	onSuccess?: (result: Branch) => void;
	/**
	 * Optional cancel handler. When provided a cancel button is rendered
	 * next to the submit button. Most useful in dialog / sheet contexts.
	 */
	onCancel?: () => void;
	/**
	 * Hide the default submit/cancel footer. Useful when the consumer wants
	 * to render its own footer (e.g. inside a Dialog with a sticky footer).
	 */
	hideFooter?: boolean;
	/**
	 * Override the default submit button label.
	 */
	submitLabel?: string;
	/**
	 * Override the default cancel button label.
	 */
	cancelLabel?: string;
	/**
	 * Render a different submit button. The default is a primary `<Button>`.
	 */
	renderSubmit?: (props: {
		submit: () => void;
		isSubmitting: boolean;
		canSubmit: boolean;
	}) => React.ReactNode;
	/**
	 * Render a different cancel button. The default is a ghost `<Button>`.
	 */
	renderCancel?: (props: { cancel: () => void }) => React.ReactNode;
	/**
	 * Optional content rendered above the form sections.
	 */
	header?: React.ReactNode;
	/**
	 * Optional className applied to the underlying `<form>` element.
	 */
	className?: string;
	/**
	 * Optional id applied to the underlying `<form>` element.
	 */
	id?: string;
}

export function BranchForm({
	branch,
	isLoadingBranch,
	onSuccess,
	onCancel,
	hideFooter,
	submitLabel,
	cancelLabel,
	renderSubmit,
	renderCancel,
	header,
	className,
	id,
}: BranchFormProps) {
	const t = useTranslations("settings.branches.form");
	const tNotifications = useTranslations("settings.branches.notifications");
	const queryClient = useQueryClient();

	const defaultValues = useMemo<BranchFormValues>(
		() =>
			branch ? branchToFormValues(branch) : getEmptyBranchFormValues(),
		[branch],
	);

	const createMutation = useMutation(
		orpc.branches.create.mutationOptions({
			onSuccess: async (data) => {
				await queryClient.invalidateQueries({
					queryKey: orpc.branches.key(),
				});
				onSuccess?.(data as Branch);
			},
		}),
	);

	const updateMutation = useMutation(
		orpc.branches.update.mutationOptions({
			onSuccess: async (data) => {
				await queryClient.invalidateQueries({
					queryKey: orpc.branches.key(),
				});
				onSuccess?.(data as Branch);
			},
		}),
	);

	const isEdit = Boolean(branch);
	const isMutating = createMutation.isPending || updateMutation.isPending;

	const form = useForm({
		defaultValues,
		validators: {
			onChange: branchFormSchema,
		},
		onSubmit: async ({ value, formApi }) => {
			try {
				if (isEdit && branch) {
					const updated = await updateMutation.mutateAsync({
						id: branch.id,
						...formValuesToUpdateInput(value),
					});
					formApi.reset(value);
					return updated;
				}
				const created = await createMutation.mutateAsync(
					formValuesToCreateInput(value),
				);
				return created;
			} catch (error) {
				/* 	const message =
					error instanceof Error && error.message
						? error.message
						: tNotifications("error");
				formApi.setErrorMap({
					onSubmit: { form: message },
				});
				throw error; */
			}
		},
	});

	const isSubmitting = useSelector(form.store, (s) => s.isSubmitting);
	const canSubmit = useSelector(
		form.store,
		(s) => s.canSubmit && !s.isSubmitting && !isMutating,
	);
	const rootError = useSelector(form.store, (s) =>
		formatFormRootError(s.errors),
	);

	const submit = () => form.handleSubmit();
	const cancel = () => {
		form.reset();
		onCancel?.();
	};

	const isDirty = useSelector(form.store, (state) => state.isDirty);

	useBlocker({
		shouldBlockFn: () => {
			if (!isDirty) return false;

			return !window.confirm(
				"Tienes cambios sin guardar. ¿Seguro que quieres salir?",
			);
		},
		enableBeforeUnload: () => isDirty,
	});

	return (
		<form
			id={id}
			className={className}
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				void form.handleSubmit();
			}}
		>
			{header}

			{rootError && (
				<Alert variant="destructive" className="mb-4">
					<TriangleAlertIcon />
					<AlertTitle>{tNotifications("error")}</AlertTitle>
					<AlertDescription>{rootError}</AlertDescription>
				</Alert>
			)}

			{isLoadingBranch ? (
				<div className="flex items-center justify-center py-12">
					<Spinner className="size-6" />
				</div>
			) : (
				<FieldGroup className="gap-8">
					<FieldSet className="gap-4">
						<div>
							<FieldLegend variant="label">
								{t("sections.basic")}
							</FieldLegend>
						</div>
						<BranchBasicFields form={form} />
					</FieldSet>

					{/*
					 * Branding selector is intentionally hidden for now — the
					 * component and its hook are kept so they can be re-enabled
					 * once a proper branding picker flow is in place.
					 */}
					{false && (
						<FieldSet className="gap-4">
							<div>
								<FieldLegend variant="label">
									{t("sections.branding")}
								</FieldLegend>
							</div>
							<BranchBrandingFields form={form} />
						</FieldSet>
					)}

					<FieldSet className="gap-4">
						<div>
							<FieldLegend variant="label">
								{t("sections.location")}
							</FieldLegend>
						</div>
						<BranchContactFields form={form} />
					</FieldSet>

					<FieldSet className="gap-4">
						<BranchScheduleFields form={form} />
					</FieldSet>
				</FieldGroup>
			)}

			{!hideFooter && !isLoadingBranch && (
				<div className="mt-8 flex items-center justify-end gap-2">
					{onCancel &&
						(renderCancel ? (
							renderCancel({ cancel })
						) : (
							<Button
								type="button"
								variant="ghost"
								onClick={cancel}
							>
								{cancelLabel}
							</Button>
						))}

					{renderSubmit ? (
						renderSubmit({ submit, isSubmitting, canSubmit })
					) : (
						<Button
							type="button"
							onClick={submit}
							//loading={isSubmitting || isMutating}
							disabled={!canSubmit}
						>
							{submitLabel}
						</Button>
					)}
				</div>
			)}
		</form>
	);
}

/**
 * Re-export the default values + transformers so consumers (page, dialog,
 * sheet wrappers) don't need to import from multiple files.
 */
export {
	branchToFormValues,
	formValuesToCreateInput,
	formValuesToUpdateInput,
	getEmptyBranchFormValues,
} from "../../lib/branch-defaults";
export { branchFormSchema } from "../../lib/branch-schema";
export type { BranchFormValues } from "../../lib/branch-schema";
