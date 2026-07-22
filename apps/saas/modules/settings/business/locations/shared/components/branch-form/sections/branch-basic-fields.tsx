import { useTranslations } from "@i18n/intl";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@repo/ui/components/field";
import { Input } from "@repo/ui/components/input";

import type { BranchFormProps } from "../../../lib/branch-schema";

interface BranchBasicFieldsProps {
	form: BranchFormProps;
}

export function BranchBasicFields({ form }: BranchBasicFieldsProps) {
	const t = useTranslations("settings.branches.form");

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
			<form.Field
				name="name"
				children={(field) => {
					const isInvalid =
						field.state.meta.isTouched && !field.state.meta.isValid;

					return (
						<Field data-invalid={isInvalid}>
							<FieldLabel htmlFor={field.name} required>
								{t("fields.name.label")}
							</FieldLabel>

							<Input
								id={field.name}
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) =>
									field.handleChange(e.target.value)
								}
								aria-invalid={isInvalid}
								placeholder={t("fields.name.placeholder")}
								autoComplete="off"
							/>

							<FieldDescription>
								{t("fields.name.description")}
							</FieldDescription>

							{isInvalid && (
								<FieldError errors={field.state.meta.errors} />
							)}
						</Field>
					);
				}}
			/>
		</div>
	);
}
