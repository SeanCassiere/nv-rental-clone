import React, { Suspense } from "react";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useFeature } from "@/hooks/useFeature";

import { SETTINGS_LOCATION_KEYS } from "@/utils/constants";

const SettingsEmailTemplatesTab = React.lazy(
  () => import("@/components/settings/runtime-configuration/email-templates")
);

const SettingsGlobalDocumentsTab = React.lazy(
  () => import("@/components/settings/runtime-configuration/global-documents")
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

const routeApi = getRouteApi("/_auth/settings/$destination/");

const SettingsRuntimeConfigurationTab = () => {
  const { t } = useTranslation("settings");

  const navigate = useNavigate({ from: "/settings/$destination" });

  const { tab } = routeApi.useSearch();

  const [adminUrlsFeature] = useFeature("SHOW_ADMIN_URLS", "");
  const adminUrlsSplit = (adminUrlsFeature || "")
    .split(",")
    .map((url) => url.trim());

  const showGlobalDocuments = adminUrlsSplit.includes("4");

  const tabs = React.useMemo(() => {
    const tabItems: TabListItem[] = [
      {
        id: "email-templates",
        title: t("titles.emailTemplates"),
        component: <SettingsEmailTemplatesTab />,
      },
    ];

    if (showGlobalDocuments) {
      tabItems.push({
        id: "global-documents",
        title: t("titles.globalDocuments"),
        component: <SettingsGlobalDocumentsTab />,
      });
    }

    // tabItems.push({
    //   id: "number-sequencing",
    //   title: t("titles.idConfiguration"),
    //   component: <Skeleton className="h-96" />,
    // });
    // tabItems.push({
    //   id: "system-lists",
    //   title: t("titles.compatibilityConfiguration"),
    //   component: <Skeleton className="h-96" />,
    // });

    return tabItems;
  }, [showGlobalDocuments, t]);

  const currentTab = tab ?? "email-templates";
  const activeTab = getValueForTabList(tabs, currentTab);
  const onTabChange = React.useCallback(
    (id: string) => {
      navigate({
        params: { destination: SETTINGS_LOCATION_KEYS.runtimeConfiguration },
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
        {t("titles.runtime")}
      </h2>
      <p className="text-base text-foreground/80">
        {t("descriptions.runtime")}
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

export default SettingsRuntimeConfigurationTab;
