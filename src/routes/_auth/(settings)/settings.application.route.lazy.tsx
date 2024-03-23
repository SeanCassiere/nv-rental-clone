import React from "react";
import {
  createLazyFileRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
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

import {
  LayoutTabNavigationItem,
  LayoutTabsNavigation,
} from "./-components/layout-tabs-navigation";

export const Route = createLazyFileRoute(
  "/_auth/(settings)/settings/application"
)({
  component: ApplicationConfigurationLayout,
});

function ApplicationConfigurationLayout() {
  const { t } = useTranslation();
  const location = useRouterState({ select: (s) => s.location });

  const [incomplete_incompleteApplicationSettingsTabs] = useLocalStorage(
    incompleteApplicationSettingsTabsFeatureFlag.id,
    incompleteApplicationSettingsTabsFeatureFlag.default_value
  );

  const tabs = React.useMemo(() => {
    const items: (() => JSX.Element)[] = [];

    items.push(() => (
      <LayoutTabNavigationItem
        pathname="/settings/application/users"
        linkProps={{
          to: "/settings/application/users",
        }}
      >
        {t("titles.systemUsers", { ns: "settings" })}
      </LayoutTabNavigationItem>
    ));

    items.push(() => (
      <LayoutTabNavigationItem
        pathname="/settings/application/permissions-and-roles"
        linkProps={{
          to: "/settings/application/permissions-and-roles",
        }}
      >
        {t("titles.permissionsAndRoles", { ns: "settings" })}
      </LayoutTabNavigationItem>
    ));

    items.push(() => (
      <LayoutTabNavigationItem
        pathname="/settings/application/locations"
        linkProps={{
          to: "/settings/application/locations",
        }}
      >
        {t("titles.locations", { ns: "settings" })}
      </LayoutTabNavigationItem>
    ));

    if (incomplete_incompleteApplicationSettingsTabs) {
      items.push(() => (
        <LayoutTabNavigationItem
          pathname="/settings/application/store-hours-and-holidays"
          linkProps={{
            to: "/settings/application/store-hours-and-holidays",
          }}
        >
          {t("titles.storeHoursAndHolidays", { ns: "settings" })}
        </LayoutTabNavigationItem>
      ));
    }

    return items;
  }, [t, incomplete_incompleteApplicationSettingsTabs]);

  return (
    <article className="grid gap-5">
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle>{t("titles.application", { ns: "settings" })}</CardTitle>
          <CardDescription>
            {t("descriptions.application", { ns: "settings" })}
          </CardDescription>
        </CardHeader>
        <CardContent className="border-t p-4">
          <LayoutTabsNavigation
            items={tabs}
            currentPathname={location.pathname}
            className="overflow-x-hidden"
          />
        </CardContent>
      </Card>
      <Outlet />
    </article>
  );
}
