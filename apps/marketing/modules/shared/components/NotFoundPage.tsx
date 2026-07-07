import { LocaleLink } from "@i18n/routing";
import { Button } from "@repo/ui";
import { ArrowLeftIcon } from "lucide-react";
import { useTranslations } from "use-intl";

export function NotFoundPage() {
	const t = useTranslations("notFound");

	return (
		<div className="flex h-full min-h-[calc(100vh-16rem)] flex-col items-center justify-center">
			<h1 className="font-bold text-5xl">{t("code")}</h1>
			<p className="mt-2 text-2xl">{t("title")}</p>

			<Button className="mt-4" render={(props) => <LocaleLink href="/" {...props} />}>
				<ArrowLeftIcon className="mr-2 size-4" /> {t("goToHomepage")}
			</Button>
		</div>
	);
}
