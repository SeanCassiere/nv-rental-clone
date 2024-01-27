import React from "react";
import {
  createLazyFileRoute,
  LinkOptions,
  Outlet,
  useMatches,
  useRouterState,
} from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Separator } from "@/components/ui/separator";

import { usePermission } from "@/hooks/usePermission";

import { UI_APPLICATION_NAME } from "@/utils/constants";

import { cn } from "@/utils";

import { SidebarDesktopNavigation } from "./-components/sidebar-desktop-navigation";
import { SidebarMobileNavigation } from "./-components/sidebar-mobile-navigation";

export const Route = createLazyFileRoute("/_auth/settings-temp")({
  component: SettingsPage,
});

type SettingsNavigationDestination = {
  id: string;
  title: string;
  linkProps: LinkOptions;
};

function SettingsPage() {
  const { t } = useTranslation();
  const location = useRouterState({ select: (s) => s.location });

  const canSeeAdminTab = usePermission("VIEW_ADMIN_TAB");

  const allRouteMatches = useMatches();
  const currentDestinationPath = React.useMemo(() => {
    const pathnames = allRouteMatches.map((route) => route.pathname);
    const destination = pathnames.find(
      (path) => path.toLowerCase() === location.pathname.toLowerCase()
    );
    return destination ?? "";
  }, [allRouteMatches, location.pathname]);

  const destinations = React.useMemo(() => {
    const items: SettingsNavigationDestination[] = [
      {
        // id: SETTINGS_LOCATION_KEYS.profile,
        id: "/settings-temp/profile",
        title: t("titles.profile", { ns: "settings" }),
        // component: <SettingsProfileTab />,
        linkProps: {
          to: "/settings-temp/",
          params: false,
          search: false,
        },
      },
    ];

    if (!canSeeAdminTab) return items;

    items.push({
      id: "/settings-temp/application",
      title: t("titles.application", { ns: "settings" }), // users, locations, taxes,
      // component: <SettingsApplicationTab />,
      linkProps: {
        to: "/settings/$destination",
        params: { destination: "application" },
        search: false,
      },
    });
    items.push({
      id: "/settings-temp/runtime-configuration",
      title: t("titles.runtime", { ns: "settings" }), // email, global documents, id configuration, compatibility, etc.
      // component: <SettingsRuntimeConfigurationTab />,
      linkProps: {
        to: "/settings/$destination",
        params: { destination: "runtime-configuration" },
        search: false,
      },
    });
    items.push({
      id: "/settings-temp/vehicles-and-categories",
      title: t("titles.vehiclesAndCategories", { ns: "settings" }), // vehicle types, vehicle makes, vehicle models, options, etc.
      // component: <Skeleton className="h-96" />,
      linkProps: {
        to: "/settings/$destination",
        params: { destination: "vehicles-and-categories" },
        search: false,
      },
    });
    items.push({
      id: "/settings-temp/rates-and-charges",
      title: t("titles.ratesAndCharges", { ns: "settings" }), // rates, rules, promotions, miscellaneous charges
      // component: <Skeleton className="h-96" />,
      linkProps: {
        to: "/settings/$destination",
        params: { destination: "rates-and-charges" },
        search: false,
      },
    });
    return items;
  }, [canSeeAdminTab, t]);

  const currentDestination = destinations.find(
    (d) => d.id === currentDestinationPath
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
            {t("titles.settings", { ns: "settings" })}
          </h1>
        </div>
        <p className={cn("text-base text-foreground/80 [text-wrap:balance]")}>
          {t("descriptions.settings", {
            ns: "settings",
            appName: UI_APPLICATION_NAME,
          })}
        </p>
        <Separator className="mt-3.5" />
      </section>
      <section
        className={cn(
          "mx-auto mb-3.5 mt-4 flex max-w-full flex-col space-y-5 px-2 sm:px-4 lg:flex-row lg:space-x-12 lg:space-y-0"
        )}
      >
        <aside className="shrink-0 border-b pb-4 lg:w-1/5 lg:border-b-0 lg:pb-0">
          <SidebarMobileNavigation
            items={destinations}
            currentId={currentDestinationPath}
          />
          <SidebarDesktopNavigation
            items={destinations}
            currentId={currentDestinationPath}
          />
        </aside>
        <div className="flex-1">
          <Outlet />
        </div>
      </section>
    </>
  );
}
