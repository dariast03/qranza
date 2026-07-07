import React from "react";
import { Link, Text } from "react-email";

import PrimaryButton from "../components/PrimaryButton";
import Wrapper from "../components/Wrapper";
import { getMailTranslator } from "../lib/i18n";
import { defaultLocale } from "../lib/translations";
import type { BaseMailProps } from "../types";

export function EmailVerification({
	url,
	locale,
}: {
	url: string;
	name: string;
} & BaseMailProps) {
	const t = getMailTranslator(locale);

	return (
		<Wrapper>
			<Text>{t("emailVerification.body")}</Text>

			<PrimaryButton href={url}>{t("emailVerification.confirmEmail")} &rarr;</PrimaryButton>

			<Text className="text-sm text-muted-foreground">
				{t("common.openLinkInBrowser")}
				<Link href={url} className="break-all">
					{url}
				</Link>
			</Text>
		</Wrapper>
	);
}

EmailVerification.PreviewProps = {
	locale: defaultLocale,
	url: "#",
	name: "John Doe",
};

export default EmailVerification;
