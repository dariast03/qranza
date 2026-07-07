import React from "react";
import { Heading, Link, Text } from "react-email";

import PrimaryButton from "../components/PrimaryButton";
import Wrapper from "../components/Wrapper";
import { getMailTranslator } from "../lib/i18n";
import { defaultLocale } from "../lib/translations";
import type { BaseMailProps } from "../types";

export function OrganizationInvitation({
	url,
	organizationName,
	locale,
}: {
	url: string;
	organizationName: string;
} & BaseMailProps) {
	const t = getMailTranslator(locale);

	return (
		<Wrapper>
			<Heading className="text-xl">
				{t("organizationInvitation.headline", { organizationName })}
			</Heading>
			<Text>{t("organizationInvitation.body", { organizationName })}</Text>

			<PrimaryButton href={url}>{t("organizationInvitation.join")}</PrimaryButton>

			<Text className="mt-4 text-sm text-muted-foreground">
				{t("common.openLinkInBrowser")}
				<Link href={url}>{url}</Link>
			</Text>
		</Wrapper>
	);
}

OrganizationInvitation.PreviewProps = {
	locale: defaultLocale,
	url: "#",
	organizationName: "Acme",
};

export default OrganizationInvitation;
