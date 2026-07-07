import { useLocalePathname, useLocaleRouter } from "@i18n/routing";
import { config as i18nConfig } from "@repo/i18n";
import { getCurrentLocale } from "@repo/i18n/runtime";
import { Button } from "@repo/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { LanguagesIcon } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "use-intl";

export function LocaleSwitch() {
	const localeRouter = useLocaleRouter();
	const localePathname = useLocalePathname();
	const t = useTranslations("common.aria");
	const currentLocale = getCurrentLocale();
	const [value, setValue] = useState<string>(currentLocale);

	if (Object.keys(i18nConfig.locales).length <= 1) {
		return null;
	}

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger
				render={
					<Button variant="ghost" size="icon" aria-label={t("language")}>
						<LanguagesIcon className="size-4" />
					</Button>
				}
			/>

			<DropdownMenuContent>
				<DropdownMenuRadioGroup
					value={value}
					onValueChange={(next) => {
						setValue(next);

						const search = typeof window !== "undefined" ? window.location.search : "";
						localeRouter.replace(`${localePathname}${search}`, {
							locale: next,
						});
					}}
				>
					{Object.entries(i18nConfig.locales).map(([locale, { label }]) => {
						return (
							<DropdownMenuRadioItem key={locale} value={locale}>
								{label}
							</DropdownMenuRadioItem>
						);
					})}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
