import React, { Suspense } from "react";
import { useNavigate, useSearch } from "@tanstack/router";

import { Skeleton } from "@/components/ui/skeleton";
import { destinationSettingsRoute } from "@/routes/settings/destination-settings-route";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TabListItem = {
  id: string;
  title: string;
  component: React.ReactNode;
};

const SettingsRuntimeConfigurationTab = () => {
  const navigate = useNavigate({ from: destinationSettingsRoute.id });

  const { tab } = useSearch({
    from: destinationSettingsRoute.id,
  });

  const currentTab = tab ?? "email-templates";
  const onTabChange = React.useCallback(
    (id: string) => {
      navigate({ search: { tab: id }, replace: true });
    },
    [navigate]
  );

  const tabs = React.useMemo(() => {
    const tabItems: TabListItem[] = [
      {
        id: "email-templates",
        title: "Email templates",
        component: <Skeleton className="h-96" />,
      },
      {
        id: "global-documents",
        title: "Global documents",
        component: <Skeleton className="h-96" />,
      },
      {
        id: "number-sequencing",
        title: "Number sequencing",
        component: <Skeleton className="h-96" />,
      },
      {
        id: "system-lists",
        title: "System lists",
        component: <Skeleton className="h-96" />,
      },
    ];

    return tabItems;
  }, []);

  return (
    <>
      <h2 className="text-xl font-semibold leading-10 text-primary">
        Runtime configuration
      </h2>
      <p className="text-base text-primary/80">
        Customize and manage your application runtime configuration with ease.
      </p>
      <Tabs
        value={currentTab}
        onValueChange={onTabChange}
        className="mt-6 overflow-x-hidden"
      >
        <TabsList className="w-full [-ms-overflow-style:none] [scrollbar-width:none] lg:max-w-max [&::-webkit-scrollbar]:hidden">
          {tabs.map((item, idx) => (
            <TabsTrigger key={`tab_trigger_${item.id}_${idx}`} value={item.id}>
              {item.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((item, idx) => (
          <TabsContent key={`tab_content_${item.id}_${idx}`} value={item.id}>
            <Suspense fallback={<Skeleton className="h-96" />}>
              {item.component}
            </Suspense>
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
};

export default SettingsRuntimeConfigurationTab;
