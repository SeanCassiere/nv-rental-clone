import React from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Separator } from "@/components/ui/separator";

import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { usePermission } from "@/lib/hooks/usePermission";

import { fetchFeaturesForClientOptions } from "@/lib/query/client";
import { fetchPermissionsByUserIdOptions } from "@/lib/query/user";

import { Container } from "@/routes/-components/container";

import { getAuthFromRouterContext } from "@/lib/utils/auth";
import { UI_APPLICATION_NAME } from "@/lib/utils/constants";

import { incompleteSettingsNavigationFeatureFlag } from "@/lib/config/features";

import { cn } from "@/lib/utils";

import {
  SidebarNavigation,
  SidebarNavigationItem,
} from "./-components/sidebar-navigation";

export const Route = createFileRoute("/_auth/(settings)/settings")({
  beforeLoad: ({ context }) => {
    const auth = getAuthFromRouterContext(context);

    return {
      authParams: auth,
      userPermissionsOptions: fetchPermissionsByUserIdOptions({
        auth,
        userId: auth.userId,
      }),
      clientFeaturesOptions: fetchFeaturesForClientOptions({ auth }),
    };
  },
  loader: async ({ context }) => {
    const { queryClient, userPermissionsOptions, clientFeaturesOptions } =
      context;

    const promises = [];
    // ensure user permissions are being loaded in
    promises.push(queryClient.ensureQueryData(userPermissionsOptions));

    // ensure client features are being loaded in
    promises.push(queryClient.ensureQueryData(clientFeaturesOptions));

    await Promise.allSettled(promises);
    return;
  },
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
    <main>
      <Container className="max-w-screen-xl pb-4" as="div">
        <section
          className={cn(
            "mx-auto mt-6 flex max-w-full flex-col gap-2 px-2 sm:mx-4 sm:px-1"
          )}
        >
          <div
            className={cn("flex min-h-[2.5rem] items-center justify-between")}
          >
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
        </section>
      </Container>
      <Separator />
      <Container className="max-w-screen-xl" as="div">
        <section
          className={cn(
            "relative mx-auto mb-5 flex max-w-full flex-col space-y-5 px-2 pt-6 sm:px-4 lg:flex-row lg:space-x-12 lg:space-y-0"
          )}
        >
          <aside className="block h-full shrink-0 pb-4 sm:px-1 lg:sticky lg:top-16 lg:w-1/5">
            <SidebarNavigation items={destinations} />
          </aside>
          <div className="flex-1">
            <Outlet />
          </div>
        </section>
      </Container>
    </main>
  );
}
