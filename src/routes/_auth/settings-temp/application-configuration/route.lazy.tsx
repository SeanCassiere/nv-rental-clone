import React from "react";
import {
  createLazyFileRoute,
  Outlet,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { SettingsLayoutHeader } from "../-components/layout-header";
import {
  LayoutTabsNavigation,
  LayoutTabsNavigationTabListItem,
} from "../-components/layout-tabs-navigation";

export const Route = createLazyFileRoute(
  "/_auth/settings-temp/application-configuration"
)({
  component: ApplicationConfigurationLayout,
});

function ApplicationConfigurationLayout() {
  const router = useRouter();
  const { t } = useTranslation();
  const location = useRouterState({ select: (s) => s.location });

  const tabs: LayoutTabsNavigationTabListItem[] = [
    {
      pathname: "/settings-temp/application-configuration/system-users",
      title: t("titles.systemUsers", { ns: "settings" }),
      linkProps: {
        to: "/settings-temp/application-configuration/system-users",
        params: true,
        search: true,
      },
    },
    {
      pathname:
        "/settings-temp/application-configuration/permissions-and-roles",
      title: t("titles.permissionsAndRoles", { ns: "settings" }),
      linkProps: {
        to: "/settings-temp/application-configuration/permissions-and-roles",
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
