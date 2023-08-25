import React, { Suspense } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";

import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { destinationSettingsRoute } from "@/routes/settings/destination-settings-route";

const SettingsUsersTab = React.lazy(
  () => import("@/components/settings/application/system-users")
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

const SettingsApplicationTab = () => {
  const navigate = useNavigate({ from: destinationSettingsRoute.id });

  const { tab } = useSearch({
    from: destinationSettingsRoute.id,
  });

  const tabs = React.useMemo(() => {
    const tabItems: TabListItem[] = [
      {
        id: "users",
        title: "System users",
        component: <SettingsUsersTab />,
      },
    ];

    tabItems.push({
      id: "permissions",
      title: "Permissions & Roles",
      component: <Skeleton className="h-96" />,
    });

    tabItems.push({
      id: "locations",
      title: "Locations",
      component: <Skeleton className="h-96" />,
    });

    return tabItems;
  }, []);

  const currentTab = tab ?? "users";
  const activeTab = getValueForTabList(tabs, currentTab);
  const onTabChange = React.useCallback(
    (id: string) => {
      navigate({ search: { tab: id }, replace: true });
    },
    [navigate]
  );

  return (
    <>
      <h2 className="text-xl font-semibold leading-10">Application</h2>
      <p className="text-base text-foreground/80">
        Customize the application settings.
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

export default SettingsApplicationTab;
