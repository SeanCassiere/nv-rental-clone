import React from "react";
import { Link, type LinkPropsOptions } from "@tanstack/react-router";

import { cn } from "@/utils";

export const AppNavigation = () => {
  const navigation: {
    name: string;
    props: LinkPropsOptions;
  }[] = [
    {
      name: "Dashboard",
      props: {
        to: "/",
        activeOptions: {
          exact: true,
        },
      },
    },
    {
      name: "Fleet",
      props: {
        to: "/fleet",
        search: (current) => ({ ...current, filters: undefined }),
      },
    },
    {
      name: "Customers",
      props: {
        to: "/customers",
        search: (current) => ({ ...current, filters: undefined }),
      },
    },
    {
      name: "Reservations",
      props: {
        to: "/reservations",
        search: (current) => ({ ...current, filters: undefined }),
      },
    },
    {
      name: "Agreements",
      props: {
        to: "/agreements",
        search: (current) => ({ ...current, filters: undefined }),
      },
    },
    {
      name: "Reports",
      props: {
        to: "/reports" as any,
      },
    },
    {
      name: "Settings",
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
            "whitespace-nowrap border-b pb-4 pt-3 leading-none transition sm:px-4"
          )}
          activeProps={{
            className: cn("border-foreground font-semibold"),
          }}
          inactiveProps={{
            className: cn("border-transparent hover:border-foreground/20"),
          }}
        >
          {navItem.name}
        </Link>
      ))}
    </nav>
  );
};
