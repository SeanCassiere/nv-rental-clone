import * as React from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useLocalStorage } from "@/lib/hooks/useLocalStorage";

import { incompleteApplicationSettingsTabsFeatureFlag } from "@/lib/config/features";

import { SubPageNavItem } from "./-components/sub-page-nav-item";

export const Route = createLazyFileRoute(
  "/_auth/(settings)/settings/application/"
)({
  component: SettingsApplicationIndex,
});

function SettingsApplicationIndex() {
  const { t } = useTranslation();

  const [incomplete_incompleteApplicationSettingsTabs] = useLocalStorage(
    incompleteApplicationSettingsTabsFeatureFlag.id,
    incompleteApplicationSettingsTabsFeatureFlag.default_value
  );

  const canSeeUsers = true;
  const canSeePermissionsAndRoles = true;
  const canSeeLocations = true;
  const canSeeStoreHoursAndHolidays =
    incomplete_incompleteApplicationSettingsTabs;

  return (
    <article>
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>{t("titles.application", { ns: "settings" })}</CardTitle>
          <CardDescription>
            {t("descriptions.application", { ns: "settings" })}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <ul role="list" className="divide-y divide-muted">
            {canSeeUsers ? (
              <SubPageNavItem
                title={t("titles.systemUsers", { ns: "settings" })}
                description={t("descriptions.systemUsers", { ns: "settings" })}
                link={{
                  to: "/settings/application/users",
                }}
              />
            ) : null}
            {canSeePermissionsAndRoles ? (
              <SubPageNavItem
                title={t("titles.permissionsAndRoles", { ns: "settings" })}
                description={t("descriptions.permissionsAndRoles", {
                  ns: "settings",
                })}
                link={{
                  to: "/settings/application/permissions-and-roles",
                }}
              />
            ) : null}
            {canSeeLocations ? (
              <SubPageNavItem
                title={t("titles.locations", { ns: "settings" })}
                description={t("descriptions.locations", { ns: "settings" })}
                link={{
                  to: "/settings/application/locations",
                }}
              />
            ) : null}
            {canSeeStoreHoursAndHolidays ? (
              <SubPageNavItem
                title={t("titles.storeHoursAndHolidays", { ns: "settings" })}
                description={t("descriptions.storeHoursAndHolidays", {
                  ns: "settings",
                })}
                link={{
                  to: "/settings/application/store-hours-and-holidays",
                }}
              />
            ) : null}
          </ul>
        </CardContent>
      </Card>
    </article>
  );
}
