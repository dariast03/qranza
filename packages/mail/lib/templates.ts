import type { Locale } from "@repo/i18n";
import type { ReactElement } from "react";
import { render } from "react-email";

import { mailTemplates } from "../emails";
import { getMailTranslator } from "./i18n";

const mailSubjects = {
	emailVerification: "emailVerification.subject",
	forgotPassword: "forgotPassword.subject",
	magicLink: "magicLink.subject",
	notification: "notification.subject",
	organizationInvitation: "organizationInvitation.subject",
} as const;

export type TemplateId = keyof typeof mailTemplates;

export async function getTemplate<T extends TemplateId>({
	templateId,
	context,
	locale,
}: {
	templateId: T;
	context: Omit<Parameters<(typeof mailTemplates)[T]>[0], "locale">;
	locale: Locale;
}) {
	const template = mailTemplates[templateId];
	const templateProps = { ...context, locale };
	const email = (template as unknown as (props: typeof templateProps) => ReactElement)(
		templateProps,
	);

	const t = getMailTranslator(locale);
	let subject = t(mailSubjects[templateId]);

	if (templateId === "notification") {
		const notificationContext = context as { title?: string };
		if (notificationContext.title) {
			subject = notificationContext.title;
		}
	}

	const html = await render(email);
	const text = await render(email, { plainText: true });
	return { html, text, subject };
}
