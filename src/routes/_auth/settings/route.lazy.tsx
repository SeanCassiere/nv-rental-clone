import React from "react";
import {
  createLazyFileRoute,
  LinkOptions,
  Outlet,
} from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Separator } from "@/components/ui/separator";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { usePermission } from "@/hooks/usePermission";

import { UI_APPLICATION_NAME } from "@/utils/constants";
import { incompleteSettingsNavigationFeatureFlag } from "@/utils/features";

import { cn } from "@/utils";

import { SidebarDesktopNavigation } from "./-components/sidebar-desktop-navigation";
import { SidebarMobileNavigation } from "./-components/sidebar-mobile-navigation";

export const Route = createLazyFileRoute("/_auth/settings")({
  component: SettingsLayout,
});

type SettingsNavigationDestination = {
  id: string;
  title: string;
  linkProps: LinkOptions;
};

function SettingsLayout() {
  const { t } = useTranslation();

  const canSeeAdminTab = usePermission("VIEW_ADMIN_TAB");
  const [incomplete_allSettingsNavigation] = useLocalStorage(
    incompleteSettingsNavigationFeatureFlag.id,
    incompleteSettingsNavigationFeatureFlag.default_value
  );

  const destinations = React.useMemo(() => {
    const items: SettingsNavigationDestination[] = [
      {
        id: "/settings/profile",
        title: t("titles.profile", { ns: "settings" }),
        linkProps: {
          to: "/settings/profile",
          params: false,
          search: false,
        },
      },
    ];

    if (canSeeAdminTab) {
      items.push({
        id: "/settings/application",
        title: t("titles.application", { ns: "settings" }), // users, locations, taxes,
        linkProps: {
          to: "/settings/application",
          params: false,
          search: false,
        },
      });
    }

    if (canSeeAdminTab && incomplete_allSettingsNavigation) {
      items.push({
        id: "/settings/runtime-configuration",
        title: t("titles.runtime", { ns: "settings" }), // email, global documents, id configuration, compatibility, etc.
        linkProps: {
          to: "/settings/runtime-configuration",
          params: false,
          search: false,
        },
      });
      items.push({
        id: "/settings/vehicles-and-categories",
        title: t("titles.vehiclesAndCategories", { ns: "settings" }), // vehicle types, vehicle makes, vehicle models, options, etc.
        linkProps: {
          to: "/settings/vehicles-and-categories",
          params: false,
          search: false,
        },
      });
      items.push({
        id: "/settings/rates-and-charges",
        title: t("titles.ratesAndCharges", { ns: "settings" }), // rates, rules, promotions, miscellaneous charges
        linkProps: {
          to: "/settings/rates-and-charges",
          params: false,
          search: false,
        },
      });
    }

    return items;
  }, [canSeeAdminTab, incomplete_allSettingsNavigation, t]);

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
          <SidebarMobileNavigation items={destinations} />
          <SidebarDesktopNavigation items={destinations} />
        </aside>
        <div className="flex-1">
          <Outlet />
        </div>
      </section>
    </>
  );
}
