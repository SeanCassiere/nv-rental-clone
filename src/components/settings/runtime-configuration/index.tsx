import React, { Suspense } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";

import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useFeature } from "@/hooks/internal/useFeature";

import { destinationSettingsRoute } from "@/routes/settings/destination-settings-route";

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

const SettingsRuntimeConfigurationTab = () => {
  const navigate = useNavigate({ from: destinationSettingsRoute.id });

  const { tab } = useSearch({
    from: destinationSettingsRoute.id,
  });

  const [adminUrlsFeature] = useFeature("SHOW_ADMIN_URLS", "");
  const adminUrlsSplit = (adminUrlsFeature || "")
    .split(",")
    .map((url) => url.trim());

  const showGlobalDocuments = adminUrlsSplit.includes("4");

  const tabs = React.useMemo(() => {
    const tabItems: TabListItem[] = [
      {
        id: "email-templates",
        title: "Email templates",
        component: <SettingsEmailTemplatesTab />,
      },
    ];

    if (showGlobalDocuments) {
      tabItems.push({
        id: "global-documents",
        title: "Global documents",
        component: <SettingsGlobalDocumentsTab />,
      });
    }

    tabItems.push({
      id: "number-sequencing",
      title: "Number sequencing",
      component: <Skeleton className="h-96" />,
    });
    tabItems.push({
      id: "system-lists",
      title: "System lists",
      component: <Skeleton className="h-96" />,
    });

    return tabItems;
  }, [showGlobalDocuments]);

  const currentTab = tab ?? "email-templates";
  const activeTab = getValueForTabList(tabs, currentTab);
  const onTabChange = React.useCallback(
    (id: string) => {
      navigate({ search: { tab: id }, replace: true });
    },
    [navigate]
  );

  return (
    <>
      <h2 className="text-xl font-semibold leading-10">
        Runtime configuration
      </h2>
      <p className="text-base text-foreground/80">
        Customize and manage your application runtime configuration with ease.
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
          <TabsContent key={`tab_content_${item.id}_${idx}`} value={item.id}>
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
