import { siX } from "simple-icons";

import { useTranslations } from "@i18n/intl";
import { SimpleIcon } from "@shared/components/simple-icon";
import { Card, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card";

export function SidebarSupportCard() {
  const t = useTranslations();

  return (
    <Card size="sm" className="overflow-hidden shadow-none group-data-[collapsible=icon]:hidden">
      <CardHeader className="min-w-0 px-4">
        <CardTitle className="truncate text-sm">{t("app.supportCard.title")}</CardTitle>
        <CardDescription className="line-clamp-2">
          {t("app.supportCard.description")}&nbsp;
          <a
            href="https://x.com/arhamkhnz"
            target="_blank"
            rel="noreferrer"
            aria-label="Reach out on X"
            className="inline-flex items-center text-foreground"
          >
            <SimpleIcon icon={siX} aria-hidden className="size-3 fill-current" />
          </a>
          .
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
