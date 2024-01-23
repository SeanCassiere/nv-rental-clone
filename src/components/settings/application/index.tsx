import React, { Suspense } from "react";
import { RouteApi, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { SETTINGS_LOCATION_KEYS } from "@/utils/constants";

const SettingsUsersTab = React.lazy(
  () => import("@/components/settings/application/system-users")
);
const SettingsPermissionsAndRolesTab = React.lazy(
  () => import("@/components/settings/application/permissions-and-roles")
);

type TabListItem = {
  id: string;
  title: string;
  component: React.ReactNode;
};

function getValueForTabList(list: TabListItem[], id: string) {
  const firstItem = list[0];
  const item = list.find((item) => item.id === id);
  return item ? item.id : firstItem ? firstItem.id : "";
}

const routeApi = new RouteApi({ id: "/_auth/settings/$destination" });

const SettingsApplicationTab = () => {
  const { t } = useTranslation("settings");

  const navigate = useNavigate({ from: "/settings/$destination" });

  const { tab } = routeApi.useSearch();

  const tabs = React.useMemo(() => {
    const tabItems: TabListItem[] = [
      {
        id: "users",
        title: t("titles.systemUsers"),
        component: <SettingsUsersTab />,
      },
    ];

    tabItems.push({
      id: "permissions",
      title: t("titles.permissionsAndRoles"),
      component: <SettingsPermissionsAndRolesTab />,
    });

    tabItems.push({
      id: "locations",
      title: t("titles.locations"),
      component: <Skeleton className="h-96" />,
    });

    return tabItems;
  }, [t]);

  const currentTab = tab ?? "users";
  const activeTab = getValueForTabList(tabs, currentTab);
  const onTabChange = React.useCallback(
    (id: string) => {
      navigate({
        params: { destination: SETTINGS_LOCATION_KEYS.application },
        search: { tab: id },
        replace: true,
        resetScroll: false,
      });
    },
    [navigate]
  );

  return (
    <>
      <h2 className="text-xl font-semibold leading-10">
        {t("titles.application")}
      </h2>
      <p className="text-base text-foreground/80">
        {t("descriptions.application")}
      </p>
      <Tabs
        value={activeTab}
        onValueChange={onTabChange}
        className="mt-6 overflow-x-hidden"
      >
        <TabsList className="w-full lg:max-w-max">
          {tabs.map((item, idx) => (
            <TabsTrigger key={`tab_trigger_${item.id}_${idx}`} value={item.id}>
              {item.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((item, idx) => (
          <TabsContent
            key={`tab_content_${item.id}_${idx}`}
            value={item.id}
            className="pt-0.5"
          >
            <Suspense fallback={<Skeleton className="h-24" />}>
              {item.component}
            </Suspense>
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
};

export default SettingsApplicationTab;
