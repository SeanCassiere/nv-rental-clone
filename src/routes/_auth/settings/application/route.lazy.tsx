import React from "react";
import {
  createLazyFileRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { SettingsLayoutHeader } from "../-components/layout-header";
import {
  LayoutTabsNavigation,
  LayoutTabsNavigationTabListItem,
} from "../-components/layout-tabs-navigation";

export const Route = createLazyFileRoute("/_auth/settings/application")({
  component: ApplicationConfigurationLayout,
});

function ApplicationConfigurationLayout() {
  const { t } = useTranslation();
  const location = useRouterState({ select: (s) => s.location });

  const tabs: LayoutTabsNavigationTabListItem[] = [
    {
      pathname: "/settings/application/users",
      title: t("titles.systemUsers", { ns: "settings" }),
      linkProps: {
        to: "/settings/application/users",
        params: true,
        search: true,
      },
    },
    {
      pathname: "/settings/application/permissions-and-roles",
      title: t("titles.permissionsAndRoles", { ns: "settings" }),
      linkProps: {
        to: "/settings/application/permissions-and-roles",
        params: true,
        search: true,
      },
    },
    {
      pathname: "/settings/application/locations",
      title: t("titles.locations", { ns: "settings" }),
      linkProps: {
        to: "/settings/application/locations",
        params: true,
        search: true,
      },
    },
  ];

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
