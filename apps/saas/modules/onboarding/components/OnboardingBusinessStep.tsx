import { useTranslations } from "@i18n/intl";
import { orpcClient } from "@shared/lib/orpc-client";
import { Button } from "@repo/ui/components/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@repo/ui/components/select";
import { toastError } from "@repo/ui/components/toast";
import { useForm, useStore } from "@tanstack/react-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { ArrowRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import slugify from "slugify";
import { z } from "zod";

const formSchema = z.object({
	name: z.string().min(2, "Business name must be at least 2 characters"),
	slug: z.string().min(2, "Slug must be at least 2 characters"),
	parentIndustryCode: z.string().min(1, "Please select a business type"),
	industryCode: z.string().min(1, "Please select a category"),
	countryCode: z.string().min(1, "Please select a country"),
	city: z.string(),
	timezone: z.string(),
});

interface Industry {
	code: string;
	name: string;
	icon: string | null;
	children: { code: string; name: string; icon: string | null }[];
}

interface OnboardingBusinessStepProps {
	onCompleted: () => void;
}

interface GeolocationData {
	countryCode: string | null;
	city: string | null;
	timezone: string | null;
}

function useClientGeolocation(): GeolocationData {
	const [data, setData] = useState<GeolocationData>({
		countryCode: null,
		city: null,
		timezone: null,
	});

	useEffect(() => {
		const controller = new AbortController();

		fetch("https://ipinfo.io/json", {
			signal: controller.signal,
			headers: { Accept: "application/json" },
		})
			.then((res) => {
				if (!res.ok) return null;
				return res.json();
			})
			.then(
				(
					result: {
						country?: string;
						city?: string;
						timezone?: string;
					} | null,
				) => {
					if (result) {
						setData({
							countryCode: result.country ?? null,
							city: result.city ?? null,
							timezone: result.timezone ?? null,
						});
					}
				},
			)
			.catch(() => {});

		return () => controller.abort();
	}, []);

	return data;
}

export function OnboardingBusinessStep({
	onCompleted,
}: OnboardingBusinessStepProps) {
	const t = useTranslations();
	const router = useRouter();
	const queryClient = useQueryClient();
	const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

	const {
		countryCode: detectedCountryCode,
		city: detectedCity,
		timezone: detectedTimezone,
	} = useClientGeolocation();

	const { data: industries = [] } = useQuery({
		queryKey: ["organizations", "industries"],
		queryFn: async () => {
			const result = await orpcClient.organizations.listIndustries();
			return result as Industry[];
		},
	});

	const { data: countries = [] } = useQuery({
		queryKey: ["organizations", "countries"],
		queryFn: async () => {
			const result = await orpcClient.organizations.listCountries();
			return result;
		},
	});

	const createOrganizationMutation = useMutation({
		mutationFn: async (data: {
			name: string;
			slug: string;
			industryCode: string;
			countryCode: string;
			city?: string;
			timezone?: string;
		}) => {
			const result =
				await orpcClient.organizations.createOrganizationSetup(data);
			return result;
		},
		onSuccess: async (result) => {
			await queryClient.invalidateQueries({
				queryKey: ["user", "organizations"],
			});

			void router.navigate({
				to: `/${result.organization.slug}`,
				replace: true,
			});

			onCompleted();
		},
		onError: () => {
			toastError(t("onboarding.notifications.accountSetupFailed"));
		},
	});

	const form = useForm({
		defaultValues: {
			name: "",
			slug: "",
			parentIndustryCode: "",
			industryCode: "",
			countryCode: "",
			city: "",
			timezone: "",
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: async ({ value }) => {
			const { parentIndustryCode, ...submitData } = value;
			await createOrganizationMutation.mutateAsync(submitData);
		},
	});

	const isSubmitting = useStore(form.store, (s) => s.isSubmitting);

	const selectedParentCode = useStore(
		form.store,
		(s) => s.values.parentIndustryCode,
	);

	useEffect(() => {
		if (detectedCountryCode) {
			form.setFieldValue("countryCode", detectedCountryCode);
		}
		if (detectedCity) {
			form.setFieldValue("city", detectedCity);
		}
		if (detectedTimezone) {
			form.setFieldValue("timezone", detectedTimezone);
		}
	}, [detectedCountryCode, detectedCity, detectedTimezone]); // oxlint-disable-line eslint-plugin-react-hooks/exhaustive-deps

	useEffect(() => {
		if (!slugManuallyEdited) {
			const name = form.state.values.name;
			if (name) {
				const generatedSlug = slugify(name, { lower: true });
				form.setFieldValue("slug", generatedSlug);
			}
		}
	}, [form.state.values.name, slugManuallyEdited]); // oxlint-disable-line eslint-plugin-react-hooks/exhaustive-deps

	useEffect(() => {
		form.setFieldValue("industryCode", "");
	}, [selectedParentCode]); // oxlint-disable-line eslint-plugin-react-hooks/exhaustive-deps

	const selectedParent = industries.find(
		(i) => i.code === selectedParentCode,
	);
	const childItems = (selectedParent?.children ?? []).map((child) => ({
		value: child.code,
		label: child.name,
	}));

	const parentItems = industries.map((industry) => ({
		value: industry.code,
		label: industry.name,
	}));

	const countryItems = countries.map((country) => ({
		value: country.code,
		label: country.name,
	}));

	return (
		<div>
			<Form form={form}>
				<form
					className="gap-6 flex flex-col items-stretch"
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						void form.handleSubmit();
					}}
				>
					<FormField name="name">
						{(field) => (
							<FormItem>
								<FormLabel>
									{t("onboarding.business.name")}
								</FormLabel>
								<FormControl>
									<Input
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) =>
											field.handleChange(e.target.value)
										}
										placeholder={t(
											"onboarding.business.namePlaceholder",
										)}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					</FormField>

					<FormField name="slug">
						{(field) => (
							<FormItem>
								<FormLabel>
									{t("onboarding.business.slug")}
								</FormLabel>
								<FormControl>
									<div className="flex items-center">
										<span className="text-sm text-foreground/60 mr-1">
											{window.location.host}/
										</span>
										<Input
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => {
												setSlugManuallyEdited(true);
												field.handleChange(
													slugify(e.target.value, {
														lower: true,
													}),
												);
											}}
											placeholder="my-business"
										/>
									</div>
								</FormControl>
								<p className="text-sm text-foreground/60">
									{t("onboarding.business.slugDescription")}
								</p>
								<FormMessage />
							</FormItem>
						)}
					</FormField>

					<FormField name="parentIndustryCode">
						{(field) => (
							<FormItem>
								<FormLabel>
									{t("onboarding.business.businessType")}
								</FormLabel>
								<Select
									value={field.state.value}
									items={parentItems}
									onValueChange={(value) => {
										if (value !== null) {
											field.handleChange(value);
										}
									}}
								>
									<SelectTrigger>
										<SelectValue
											placeholder={t(
												"onboarding.business.businessTypePlaceholder",
											)}
										/>
									</SelectTrigger>
									<SelectContent>
										{parentItems.map((item) => (
											<SelectItem
												key={item.value}
												value={item.value}
												label={item.label}
											>
												{item.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					</FormField>

					{selectedParentCode && (
						<FormField name="industryCode">
							{(field) => (
								<FormItem>
									<FormLabel>
										{t("onboarding.business.category")}
									</FormLabel>
									<Select
										value={field.state.value}
										items={childItems}
										onValueChange={(value) => {
											if (value !== null) {
												field.handleChange(value);
											}
										}}
									>
										<SelectTrigger>
											<SelectValue
												placeholder={t(
													"onboarding.business.categoryPlaceholder",
												)}
											/>
										</SelectTrigger>
										<SelectContent>
											{childItems.map((item) => (
												<SelectItem
													key={item.value}
													value={item.value}
													label={item.label}
												>
													{item.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						</FormField>
					)}

					<FormField name="countryCode">
						{(field) => (
							<FormItem>
								<FormLabel>
									{t("onboarding.business.country")}
								</FormLabel>
								<Select
									value={field.state.value}
									items={countryItems}
									onValueChange={(value) => {
										if (value !== null) {
											field.handleChange(value);
										}
									}}
								>
									<SelectTrigger>
										<SelectValue
											placeholder={t(
												"onboarding.business.countryPlaceholder",
											)}
										/>
									</SelectTrigger>
									<SelectContent>
										{countryItems.map((item) => (
											<SelectItem
												key={item.value}
												value={item.value}
												label={item.label}
											>
												{item.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					</FormField>

					<Button type="submit" loading={isSubmitting}>
						{t("onboarding.continue")}
						<ArrowRightIcon className="ml-2 size-4" />
					</Button>
				</form>
			</Form>
		</div>
	);
}
