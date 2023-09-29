import React from "react";
import { Link, type LinkPropsOptions } from "@tanstack/react-router";

import { useFeature } from "@/hooks/internal/useFeature";

import { APP_DEFAULTS } from "@/utils/constants";

import { cn } from "@/utils";

type AppNavigationLinks = {
  name: string;
  props: Omit<
    LinkPropsOptions,
    "children" | "className" | "activeProps" | "inactiveProps"
  >;
}[];

const defaultActiveOptions: LinkPropsOptions["activeOptions"] = {
  exact: false,
  includeHash: false,
  includeSearch: false,
};

export const AppNavigation = () => {
  const [featureRowCount] = useFeature("DEFAULT_ROW_COUNT");
  const tableRowCount = React.useMemo(
    () => parseInt(featureRowCount || APP_DEFAULTS.tableRowCount, 10),
    [featureRowCount]
  );

  const navigation: AppNavigationLinks = [
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
        search: (current) => ({
          ...current,
          page: 1,
          size: tableRowCount,
          filters: undefined,
        }),
        activeOptions: defaultActiveOptions,
      },
    },
    {
      name: "Customers",
      props: {
        to: "/customers",
        search: (current) => ({
          ...current,
          page: 1,
          size: tableRowCount,
          filters: undefined,
        }),
        activeOptions: defaultActiveOptions,
      },
    },
    {
      name: "Reservations",
      props: {
        to: "/reservations",
        search: (current) => ({
          ...current,
          page: 1,
          size: tableRowCount,
          filters: undefined,
        }),
        activeOptions: defaultActiveOptions,
      },
    },
    {
      name: "Agreements",
      props: {
        to: "/agreements",
        search: (current) => ({
          ...current,
          page: 1,
          size: tableRowCount,
          filters: undefined,
        }),
        activeOptions: defaultActiveOptions,
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
        activeOptions: defaultActiveOptions,
      },
    },
  ];

  return (
    <nav className="-mb-px overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] md:px-10 [&::-webkit-scrollbar]:hidden">
      <ul className="flex space-x-5 sm:space-x-0.5">
        {navigation.map((item, idx) => (
          <li key={`header_app_nav_${idx}`}>
            <Link
              {...item.props}
              className={cn(
                "inline-block whitespace-nowrap border-b pb-4 pt-3 leading-none transition-all sm:px-4",
                idx + 1 === navigation.length && "mr-4 sm:mr-0"
              )}
              activeProps={{
                className: cn("border-foreground font-semibold"),
              }}
              inactiveProps={{
                className: cn("border-transparent hover:border-foreground/20"),
              }}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
