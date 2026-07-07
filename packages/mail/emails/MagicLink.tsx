import React from "react";
import { Link, Text } from "react-email";

import PrimaryButton from "../components/PrimaryButton";
import Wrapper from "../components/Wrapper";
import { getMailTranslator } from "../lib/i18n";
import { defaultLocale } from "../lib/translations";
import type { BaseMailProps } from "../types";

export function MagicLink({
	url,
	locale,
}: {
	url: string;
} & BaseMailProps) {
	const t = getMailTranslator(locale);

	return (
		<Wrapper>
			<Text>{t("magicLink.body")}</Text>

			<Text>{t("common.useLink")}</Text>

			<PrimaryButton href={url}>{t("magicLink.login")} &rarr;</PrimaryButton>

			<Text className="text-sm text-muted-foreground">
				{t("common.openLinkInBrowser")}
				<Link href={url}>{url}</Link>
			</Text>
		</Wrapper>
	);
}

MagicLink.PreviewProps = {
	locale: defaultLocale,
	url: "#",
};

export default MagicLink;
