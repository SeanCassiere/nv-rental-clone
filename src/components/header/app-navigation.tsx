import React from "react";
import { Link, useRouter } from "@tanstack/router";

import { useAuthValues } from "@/hooks/internal/useAuthValues";

import { searchAgreementsRoute } from "@/routes/agreements/search-agreements-route";
import { searchCustomersRoute } from "@/routes/customers/search-customers-route";
import { searchFleetRoute } from "@/routes/fleet/search-fleet-route";
import { searchReservationsRoute } from "@/routes/reservations/search-reservations-route";
import { mainSettingsRoute } from "@/routes/settings/main-settings-route";

import { APP_DEFAULTS, USER_STORAGE_KEYS } from "@/utils/constants";
import { getLocalStorageForUser } from "@/utils/user-local-storage";

import { indexRoute } from "@/routes";
import { cn } from "@/utils";

export const AppNavigation = () => {
  const router = useRouter();
  const auth = useAuthValues();

  const rowCountStr =
    getLocalStorageForUser(
      auth.clientId,
      auth.userId,
      USER_STORAGE_KEYS.tableRowCount
    ) || APP_DEFAULTS.tableRowCount;
  const defaultRowCount = parseInt(rowCountStr, 10);

  const routerStore = router.__store.state;

  const matches = (routes: string[], mode: "=" | "~" = "~") => {
    const matching: string[] = [...routerStore.matches.map((mat) => mat.id)];

    // because this comes out like ['/','/customers','/customers/$customerId'] or ['/','/']
    // we take out the first element in the array
    matching.shift();

    if (mode === "=") {
      // exact match
      // return matching.some((mat) => mat === routes);

      return routes.some((route) => matching.includes(route as any));
    }
    // return matching.some((mat) => mat.includes(routes));
    return matching.some((mat) => routes.includes(mat));
  };

  const navigation = [
    {
      name: "Dashboard",
      href: indexRoute.to,
      current: matches(["/"], "="),
      props: {},
    },
    {
      name: "Fleet",
      href: searchFleetRoute.to,
      current: matches(["/fleet", "/fleet/$vehicleId"]),
      props: {
        search: () => ({ page: 1, size: defaultRowCount }),
      },
    },
    {
      name: "Customers",
      href: searchCustomersRoute.to,
      current: matches(["/customers", "/customers/$customerId"]),
      props: {
        search: () => ({ page: 1, size: defaultRowCount }),
      },
    },
    {
      name: "Reservations",
      href: searchReservationsRoute.to,
      current: matches(["/reservations", "/reservations/$reservationId"]),
      props: {
        search: () => ({ page: 1, size: defaultRowCount }),
      },
    },
    {
      name: "Agreements",
      href: searchAgreementsRoute.to,
      current: matches(["/agreements", "/agreements/$agreementId"]),
      props: {
        search: () => ({ page: 1, size: defaultRowCount }),
      },
    },
    {
      name: "Reports",
      href: searchAgreementsRoute.to,
      current: matches(["/reports", "/reports/$reportId"]),
      props: {},
    },
    {
      name: "Settings",
      href: mainSettingsRoute.to,
      current: matches(["/settings", "/settings/$location"]),
      props: {},
    },
  ];

  return (
    <nav className="-mb-px flex space-x-5 overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:space-x-0 md:px-10 [&::-webkit-scrollbar]:hidden">
      {navigation.map((navItem) => (
        <Link
          key={`nav_${navItem.name}`}
          to={navItem.href as any}
          preload="intent"
          className={cn(
            navItem.current
              ? "whitespace-nowrap border-b border-foreground pb-4 pt-3 font-semibold leading-none transition sm:px-4"
              : "whitespace-nowrap border-b border-transparent pb-4 pt-3 leading-none transition hover:border-foreground/20 dark:hover:border-foreground/20 sm:px-4"
          )}
          {...navItem.props}
        >
          {navItem.name}
        </Link>
      ))}
    </nav>
  );
};
