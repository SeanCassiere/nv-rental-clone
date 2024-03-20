import React from "react";
import {
  createLazyFileRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { useLocalStorage } from "@/lib/hooks/useLocalStorage";

import { incompleteApplicationSettingsTabsFeatureFlag } from "@/lib/config/features";

import { SettingsLayoutHeader } from "./-components/layout-header";
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
    <React.Fragment>
      <SettingsLayoutHeader
        title={t("titles.application", { ns: "settings" })}
        subtitle={t("descriptions.application", { ns: "settings" })}
      />
      <LayoutTabsNavigation
        items={tabs}
        currentPathname={location.pathname}
        className="mt-6 overflow-x-hidden"
      />
      <div className="mt-2">
        <Outlet />
      </div>
    </React.Fragment>
  );
}
