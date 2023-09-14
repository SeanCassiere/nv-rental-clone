import React from "react";
import { Link, useRouter, type LinkPropsOptions } from "@tanstack/react-router";

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

  const navigation: {
    name: string;
    current: boolean;
    props: LinkPropsOptions;
  }[] = [
    {
      name: "Dashboard",
      current: matches(["/"], "="),
      props: {
        to: "/",
      },
    },
    {
      name: "Fleet",
      current: matches(["/fleet", "/fleet/$vehicleId"]),
      props: {
        to: "/fleet",
      },
    },
    {
      name: "Customers",
      current: matches(["/customers", "/customers/$customerId"]),
      props: {
        to: "/customers",
      },
    },
    {
      name: "Reservations",
      current: matches(["/reservations", "/reservations/$reservationId"]),
      props: {
        to: "/reservations",
      },
    },
    {
      name: "Agreements",
      current: matches(["/agreements", "/agreements/$agreementId"]),
      props: {
        to: "/agreements",
      },
    },
    {
      name: "Reports",
      current: matches(["/reports", "/reports/$reportId"]),
      props: {
        to: "/agreements",
      },
    },
    {
      name: "Settings",
      current: matches(["/settings", "/settings/$location"]),
      props: {
        to: "/settings",
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
