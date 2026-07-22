import { useTranslations } from "@i18n/intl";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@repo/ui/components/field";
import { Skeleton } from "@repo/ui/components/skeleton";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxGroup,
	ComboboxLabel,
	ComboboxCollection,
	ComboboxSeparator,
} from "@repo/ui/components/combobox";

import { useBrandings } from "../../../hooks/use-brandings";
import type { BranchFormProps } from "../../../lib/branch-schema";
import { PlusIcon } from "lucide-react";

interface BranchBrandingFieldsProps {
	form: BranchFormProps;
}

type CreateBrandingOption = {
	type: "create";
	id: "create-branding";
	value: "create";
	label: string;
	searchText: string;
};

type BrandingOption = {
	type: "branding";
	id: string;
	value: string;
	label: string;
	primaryColor?: string | null;
	searchText: string;
};

type BrandingSelectionItem = BrandingOption | CreateBrandingOption;

export function BranchBrandingFields({ form }: BranchBrandingFieldsProps) {
	const t = useTranslations("settings.branches.form");
	const { data: brandings, isLoading } = useBrandings();

	const brandingOptions: BrandingOption[] =
		brandings?.map((branding) => ({
			type: "branding",
			id: branding.id,
			value: branding.id,
			label: branding.name,
			primaryColor: branding.primaryColor,
			searchText: branding.name,
		})) ?? [];

	const createBrandingOption: CreateBrandingOption = {
		type: "create",
		id: "create-branding",
		value: "create",
		label: t("fields.brandingId.create"),
		searchText: "create new branding add branding",
	};

	const items: BrandingSelectionItem[] = [
		...brandingOptions,
		createBrandingOption,
	];

	return (
		<form.Field
			name="brandingId"
			children={(field) => {
				const isInvalid =
					field.state.meta.isTouched && !field.state.meta.isValid;

				const selectedBranding = brandings?.find(
					(branding) => branding.id === field.state.value,
				);

				return (
					<Field data-invalid={isInvalid}>
						<FieldLabel htmlFor="branch-branding">
							{t("fields.brandingId.label")}
						</FieldLabel>

						<Combobox
							items={brandings ?? []}
							value={
								brandingOptions.find(
									(item) => item.id === field.state.value,
								) ?? null
							}
							onValueChange={(item) => {
								if (!item) return;

								if (item.type === "create") {
									alert(1);
									return;
								}

								field.handleChange(item.id);
							}}
							itemToStringValue={(item) => item.searchText}
						>
							<ComboboxInput
								id="branch-branding"
								placeholder={t("fields.brandingId.placeholder")}
								aria-invalid={isInvalid}
							/>

							<ComboboxContent>
								<ComboboxEmpty>
									{t("fields.brandingId.empty")}
								</ComboboxEmpty>

								<ComboboxList>
									<ComboboxGroup items={brandingOptions}>
										<ComboboxLabel>
											{t("fields.brandingId.available")}
										</ComboboxLabel>

										<ComboboxCollection>
											{(branding) => (
												<ComboboxItem
													key={branding.id}
													value={branding}
												>
													<div className="flex items-center gap-2">
														{branding.primaryColor && (
															<span
																className="size-3 rounded-full border"
																style={{
																	backgroundColor:
																		branding.primaryColor,
																}}
															/>
														)}

														{branding.label}
													</div>
												</ComboboxItem>
											)}
										</ComboboxCollection>
									</ComboboxGroup>

									<ComboboxSeparator />

									<ComboboxGroup
										items={[createBrandingOption]}
									>
										<ComboboxLabel>
											{t("fields.brandingId.actions")}
										</ComboboxLabel>

										<ComboboxCollection>
											{(item) => (
												<ComboboxItem
													key={item.id}
													value={item}
												>
													<span className="flex items-center gap-2">
														<PlusIcon className="size-4" />
														{item.label}
													</span>
												</ComboboxItem>
											)}
										</ComboboxCollection>
									</ComboboxGroup>
								</ComboboxList>
							</ComboboxContent>
						</Combobox>

						<FieldDescription>
							{t("fields.brandingId.description")}
						</FieldDescription>

						{isInvalid && (
							<FieldError errors={field.state.meta.errors} />
						)}
					</Field>
				);
			}}
		/>
	);
}
