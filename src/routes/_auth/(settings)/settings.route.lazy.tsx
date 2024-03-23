import React from "react";
import { createLazyFileRoute, Outlet } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Separator } from "@/components/ui/separator";

import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { usePermission } from "@/lib/hooks/usePermission";

import { Container } from "@/routes/-components/container";

import { UI_APPLICATION_NAME } from "@/lib/utils/constants";

import { incompleteSettingsNavigationFeatureFlag } from "@/lib/config/features";

import { cn } from "@/lib/utils";

import {
  SidebarNavigation,
  SidebarNavigationItem,
} from "./-components/sidebar-navigation";

export const Route = createLazyFileRoute("/_auth/(settings)/settings")({
  component: SettingsLayout,
});

function SettingsLayout() {
  const { t } = useTranslation();

  const canSeeAdminTab = usePermission("VIEW_ADMIN_TAB");
  const [incomplete_allSettingsNavigation] = useLocalStorage(
    incompleteSettingsNavigationFeatureFlag.id,
    incompleteSettingsNavigationFeatureFlag.default_value
  );

  const destinations = React.useMemo(() => {
    const items: (() => JSX.Element)[] = [];

    // user profile
    items.push(() => (
      <SidebarNavigationItem to="/settings/profile" search={false}>
        {t("titles.profile", { ns: "settings" })}
      </SidebarNavigationItem>
    ));

    if (canSeeAdminTab) {
      // users, locations, taxes,
      items.push(() => (
        <SidebarNavigationItem to="/settings/application" search={false}>
          {t("titles.application", { ns: "settings" })}
        </SidebarNavigationItem>
      ));
    }

    if (canSeeAdminTab && incomplete_allSettingsNavigation) {
      // email, global documents, id configuration, compatibility, etc.
      items.push(() => (
        <SidebarNavigationItem
          to="/settings/runtime-configuration"
          search={false}
        >
          {t("titles.runtime", { ns: "settings" })}
        </SidebarNavigationItem>
      ));

      // vehicle types, vehicle makes, vehicle models, options, etc.
      items.push(() => (
        <SidebarNavigationItem
          to="/settings/vehicles-and-categories"
          search={false}
        >
          {t("titles.vehiclesAndCategories", { ns: "settings" })}
        </SidebarNavigationItem>
      ));

      // rates, rules, promotions, miscellaneous charges
      items.push(() => (
        <SidebarNavigationItem to="/settings/rates-and-charges" search={false}>
          {t("titles.ratesAndCharges", { ns: "settings" })}
        </SidebarNavigationItem>
      ));
    }

    return items;
  }, [t, canSeeAdminTab, incomplete_allSettingsNavigation]);

  return (
    <Container>
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
        <p className={cn("text-balance text-base text-foreground/80")}>
          {t("descriptions.settings", {
            ns: "settings",
            appName: UI_APPLICATION_NAME,
          })}
        </p>
        <Separator className="mt-3.5" />
      </section>
      <section
        className={cn(
          "mx-auto mb-5 mt-4 flex max-w-full flex-col space-y-5 px-2 sm:px-4 lg:flex-row lg:space-x-12 lg:space-y-0"
        )}
      >
        <aside className="shrink-0 border-b pb-4 sm:px-1 lg:w-1/5 lg:border-b-0 lg:pb-0">
          <SidebarNavigation items={destinations} />
        </aside>
        <div className="flex-1">
          <Outlet />
        </div>
      </section>
    </Container>
  );
}
