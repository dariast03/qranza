import { setLocaleCookie } from "@i18n/lib/update-locale";
import { useLocalePathname, useLocaleRouter } from "@i18n/routing";
import type { Locale } from "@repo/i18n";
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
import { useIsClient } from "usehooks-ts";

export function LocaleSwitch() {
	const localeRouter = useLocaleRouter();
	const localePathname = useLocalePathname();
	const currentLocale = getCurrentLocale();
	const [value, setValue] = useState<string>(currentLocale);
	const isClient = useIsClient();

	if (!isClient || Object.keys(i18nConfig.locales).length <= 1) {
		return null;
	}

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger
				render={
					<Button variant="ghost" size="icon" aria-label="Language">
						<LanguagesIcon className="size-4" />
					</Button>
				}
			/>

			<DropdownMenuContent>
				<DropdownMenuRadioGroup
					value={value}
					onValueChange={(next) => {
						setValue(next);
						setLocaleCookie(next as Locale);
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
