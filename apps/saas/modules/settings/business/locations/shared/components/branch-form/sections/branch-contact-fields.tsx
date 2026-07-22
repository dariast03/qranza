import { useTranslations } from "@i18n/intl";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@repo/ui/components/field";
import { Input } from "@repo/ui/components/input";
import { Textarea } from "@repo/ui/components/textarea";

import type { BranchFormProps } from "../../../lib/branch-schema";

interface BranchContactFieldsProps {
	form: BranchFormProps;
}

export function BranchContactFields({ form }: BranchContactFieldsProps) {
	const t = useTranslations("settings.branches.form");

	return (
		<div className="grid grid-cols-1 gap-4">
			<form.Field
				name="address"
				children={(field) => {
					const isInvalid =
						field.state.meta.isTouched && !field.state.meta.isValid;

					return (
						<Field data-invalid={isInvalid}>
							<FieldLabel htmlFor={field.name}>
								{t("fields.address.label")}
							</FieldLabel>

							<Textarea
								id={field.name}
								name={field.name}
								value={field.state.value ?? ""}
								onBlur={field.handleBlur}
								onChange={(e) =>
									field.handleChange(e.target.value)
								}
								aria-invalid={isInvalid}
								placeholder={t("fields.address.placeholder")}
								rows={2}
							/>

							<FieldDescription>
								{t("fields.address.description")}
							</FieldDescription>

							{isInvalid && (
								<FieldError errors={field.state.meta.errors} />
							)}
						</Field>
					);
				}}
			/>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<form.Field
					name="city"
					children={(field) => {
						const isInvalid =
							field.state.meta.isTouched &&
							!field.state.meta.isValid;

						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel htmlFor={field.name}>
									{t("fields.city.label")}
								</FieldLabel>

								<Input
									id={field.name}
									name={field.name}
									value={field.state.value ?? ""}
									onBlur={field.handleBlur}
									onChange={(e) =>
										field.handleChange(e.target.value)
									}
									aria-invalid={isInvalid}
									placeholder={t("fields.city.placeholder")}
								/>

								{isInvalid && (
									<FieldError
										errors={field.state.meta.errors}
									/>
								)}
							</Field>
						);
					}}
				/>

				<form.Field
					name="countryCode"
					children={(field) => {
						const isInvalid =
							field.state.meta.isTouched &&
							!field.state.meta.isValid;

						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel htmlFor={field.name}>
									{t("fields.countryCode.label")}
								</FieldLabel>

								<Input
									id={field.name}
									name={field.name}
									value={field.state.value ?? ""}
									onBlur={field.handleBlur}
									onChange={(e) =>
										field.handleChange(
											e.target.value.toUpperCase(),
										)
									}
									aria-invalid={isInvalid}
									maxLength={2}
									placeholder={t(
										"fields.countryCode.placeholder",
									)}
								/>

								<FieldDescription>
									{t("fields.countryCode.description")}
								</FieldDescription>

								{isInvalid && (
									<FieldError
										errors={field.state.meta.errors}
									/>
								)}
							</Field>
						);
					}}
				/>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<form.Field
					name="phone"
					children={(field) => {
						const isInvalid =
							field.state.meta.isTouched &&
							!field.state.meta.isValid;

						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel htmlFor={field.name}>
									{t("fields.phone.label")}
								</FieldLabel>

								<Input
									id={field.name}
									name={field.name}
									type="tel"
									value={field.state.value ?? ""}
									onBlur={field.handleBlur}
									onChange={(e) =>
										field.handleChange(e.target.value)
									}
									aria-invalid={isInvalid}
									placeholder={t("fields.phone.placeholder")}
								/>

								{isInvalid && (
									<FieldError
										errors={field.state.meta.errors}
									/>
								)}
							</Field>
						);
					}}
				/>

				<form.Field
					name="email"
					children={(field) => {
						const isInvalid =
							field.state.meta.isTouched &&
							!field.state.meta.isValid;

						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel htmlFor={field.name}>
									{t("fields.email.label")}
								</FieldLabel>

								<Input
									id={field.name}
									name={field.name}
									type="email"
									value={field.state.value ?? ""}
									onBlur={field.handleBlur}
									onChange={(e) =>
										field.handleChange(e.target.value)
									}
									aria-invalid={isInvalid}
									placeholder={t("fields.email.placeholder")}
								/>

								<FieldDescription>
									{t("fields.email.description")}
								</FieldDescription>

								{isInvalid && (
									<FieldError
										errors={field.state.meta.errors}
									/>
								)}
							</Field>
						);
					}}
				/>
			</div>

			<form.Field
				name="website"
				children={(field) => {
					const isInvalid =
						field.state.meta.isTouched && !field.state.meta.isValid;

					return (
						<Field data-invalid={isInvalid}>
							<FieldLabel htmlFor={field.name}>
								{t("fields.website.label")}
							</FieldLabel>

							<Input
								id={field.name}
								name={field.name}
								type="url"
								value={field.state.value ?? ""}
								onBlur={field.handleBlur}
								onChange={(e) =>
									field.handleChange(e.target.value)
								}
								aria-invalid={isInvalid}
								placeholder={t("fields.website.placeholder")}
							/>

							<FieldDescription>
								{t("fields.website.description")}
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
