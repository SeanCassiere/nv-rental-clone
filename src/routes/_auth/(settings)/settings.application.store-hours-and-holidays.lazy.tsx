import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { icons } from "@/components/ui/icons";

import { cn } from "@/lib/utils";

export const Route = createLazyFileRoute(
  "/_auth/(settings)/settings/application/store-hours-and-holidays"
)({
  component: StoreHoursAndHolidaysPage,
});

function StoreHoursAndHolidaysPage() {
  const { t } = useTranslation();
  return (
    <article className="grid gap-4">
      <div>
        <Link
          from="/settings/application/store-hours-and-holidays"
          to="../"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          <icons.ChevronLeft className="mr-2 h-3 w-3" />
          <span>{t("buttons.back", { ns: "labels" })}</span>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>
            {t("titles.storeHoursAndHolidays", { ns: "settings" })}
          </CardTitle>
          <CardDescription>
            {t("descriptions.storeHoursAndHolidays", {
              ns: "settings",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Hello /_auth/settings/application/store-hours-and-holidays!</p>
        </CardContent>
      </Card>
    </article>
  );
}
