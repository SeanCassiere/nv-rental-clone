import React from "react";
import {
  createLazyFileRoute,
  getRouteApi,
  type LinkOptions,
} from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { SelectorSettingsNavigation } from "@/components/settings/nav-selector";
import { SidebarSettingsNavigation } from "@/components/settings/nav-sidebar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { usePermission } from "@/hooks/usePermission";

import { SETTINGS_LOCATION_KEYS, UI_APPLICATION_NAME } from "@/utils/constants";
import { titleMaker } from "@/utils/title-maker";

import { cn } from "@/utils";

type SettingsNavigationDestination = {
  id: string;
  title: string;
  component: React.ReactNode;
  linkProps: LinkOptions;
};

const SettingsProfileTab = React.lazy(
  () => import("@/components/settings/profile")
);
const SettingsApplicationTab = React.lazy(
  () => import("@/components/settings/application")
);
const SettingsRuntimeConfigurationTab = React.lazy(
  () => import("@/components/settings/runtime-configuration")
);

export const Route = createLazyFileRoute("/_auth/settings/$destination/")({
  component: SettingsDestinationPage,
});

const routeApi = getRouteApi("/_auth/settings/$destination/");

function SettingsDestinationPage() {
  const { t } = useTranslation("settings");

  const { destination = "profile" } = routeApi.useParams();

  const canSeeAdminTab = usePermission("VIEW_ADMIN_TAB");

  const destinations = React.useMemo(() => {
    const items: SettingsNavigationDestination[] = [
      {
        id: SETTINGS_LOCATION_KEYS.profile,
        title: t("titles.profile"),
        component: <SettingsProfileTab />,
        linkProps: {
          to: "/settings/$destination",
          params: { destination: "profile" },
          search: false,
        },
      },
    ];

    if (!canSeeAdminTab) return items;

    items.push({
      id: SETTINGS_LOCATION_KEYS.application,
      title: t("titles.application"), // users, locations, taxes,
      component: <SettingsApplicationTab />,
      linkProps: {
        to: "/settings/$destination",
        params: { destination: "application" },
        search: false,
      },
    });
    items.push({
      id: SETTINGS_LOCATION_KEYS.runtimeConfiguration,
      title: t("titles.runtime"), // email, global documents, id configuration, compatibility, etc.
      component: <SettingsRuntimeConfigurationTab />,
      linkProps: {
        to: "/settings/$destination",
        params: { destination: "runtime-configuration" },
        search: false,
      },
    });
    items.push({
      id: SETTINGS_LOCATION_KEYS.vehiclesAndCategories,
      title: t("titles.vehiclesAndCategories"), // vehicle types, vehicle makes, vehicle models, options, etc.
      component: <Skeleton className="h-96" />,
      linkProps: {
        to: "/settings/$destination",
        params: { destination: "vehicles-and-categories" },
        search: false,
      },
    });
    items.push({
      id: SETTINGS_LOCATION_KEYS.ratesAndCharges,
      title: t("titles.ratesAndCharges"), // rates, rules, promotions, miscellaneous charges
      component: <Skeleton className="h-96" />,
      linkProps: {
        to: "/settings/$destination",
        params: { destination: "rates-and-charges" },
        search: false,
      },
    });
    return items;
  }, [canSeeAdminTab, t]);

  const getNavigationItem = React.useCallback(
    (id: string) => {
      const find = destinations.find(
        (item) => item.id.toLowerCase() === id.toLowerCase()
      );
      if (find) {
        return find;
      }
      return destinations[0];
    },
    [destinations]
  );

  const currentDestination = React.useMemo(
    () => getNavigationItem(destination)!,
    [destination, getNavigationItem]
  );

  useDocumentTitle(
    titleMaker(
      t("titles.page", { pageTitle: currentDestination?.title || "Unknown" })
    )
  );

  return (
    <>
      <section
        className={cn(
          "mx-auto mt-6 flex max-w-full flex-col gap-2 px-2 pt-1.5 sm:mx-4 sm:px-1"
        )}
      >
        <div className={cn("flex min-h-[2.5rem] items-center justify-between")}>
          <h1 className="text-2xl font-semibold leading-6">
            {t("titles.settings")}
          </h1>
        </div>
        <p className={cn("text-base text-foreground/80 [text-wrap:balance]")}>
          {t("descriptions.settings", { appName: UI_APPLICATION_NAME })}
        </p>
        <Separator className="mt-3.5" />
      </section>
      <section
        className={cn(
          "mx-auto mb-3.5 mt-4 flex max-w-full flex-col space-y-5 px-2 sm:px-4 lg:flex-row lg:space-x-12 lg:space-y-0"
        )}
      >
        <aside className="shrink-0 border-b pb-4 lg:w-1/5 lg:border-b-0 lg:pb-0">
          <SelectorSettingsNavigation
            items={destinations}
            currentId={currentDestination.id}
            currentTitle={currentDestination?.title || "Unknown"}
          />
          <SidebarSettingsNavigation
            items={destinations}
            currentId={currentDestination.id}
          />
        </aside>
        <div className="flex-1">
          <React.Suspense fallback={<Skeleton className="h-96 w-full" />}>
            {currentDestination?.component || null}
          </React.Suspense>
        </div>
      </section>
    </>
  );
}
