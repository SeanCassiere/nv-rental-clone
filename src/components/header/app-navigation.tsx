import React from "react";
import { Link, useRouter } from "@tanstack/react-router";

import { searchAgreementsRoute } from "@/routes/agreements/search-agreements-route";
import { searchCustomersRoute } from "@/routes/customers/search-customers-route";
import { searchFleetRoute } from "@/routes/fleet/search-fleet-route";
import { searchReservationsRoute } from "@/routes/reservations/search-reservations-route";
import { mainSettingsRoute } from "@/routes/settings/main-settings-route";

import { indexRoute } from "@/routes";
import { cn } from "@/utils";

export const AppNavigation = () => {
  const router = useRouter();
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
      current: matches(["/"], "="),
      props: {
        to: indexRoute.to,
      },
    },
    {
      name: "Fleet",
      current: matches(["/fleet", "/fleet/$vehicleId"]),
      props: {
        to: searchFleetRoute.to,
      },
    },
    {
      name: "Customers",
      current: matches(["/customers", "/customers/$customerId"]),
      props: {
        to: searchCustomersRoute.to,
      },
    },
    {
      name: "Reservations",
      current: matches(["/reservations", "/reservations/$reservationId"]),
      props: {
        to: searchReservationsRoute.to,
      },
    },
    {
      name: "Agreements",
      current: matches(["/agreements", "/agreements/$agreementId"]),
      props: {
        to: searchAgreementsRoute.to,
      },
    },
    {
      name: "Reports",
      current: matches(["/reports", "/reports/$reportId"]),
      props: {
        to: searchAgreementsRoute.to,
      },
    },
    {
      name: "Settings",
      current: matches(["/settings", "/settings/$location"]),
      props: {
        to: mainSettingsRoute.to,
      },
    },
  ];

  return (
    <nav className="-mb-px flex space-x-5 overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:space-x-0 md:px-10 [&::-webkit-scrollbar]:hidden">
      {navigation.map((navItem) => (
        <Link
          key={`nav_${navItem.name}`}
          {...navItem.props}
          className={cn(
            navItem.current
              ? "whitespace-nowrap border-b border-foreground pb-4 pt-3 font-semibold leading-none transition sm:px-4"
              : "whitespace-nowrap border-b border-transparent pb-4 pt-3 leading-none transition hover:border-foreground/20 dark:hover:border-foreground/20 sm:px-4"
          )}
        >
          {navItem.name}
        </Link>
      ))}
    </nav>
  );
};
