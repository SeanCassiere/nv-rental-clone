import React from "react";
import { Link, type LinkOptions } from "@tanstack/react-router";

import { useFeature } from "@/hooks/internal/useFeature";

import { APP_DEFAULTS } from "@/utils/constants";

import { cn } from "@/utils";

type AppNavigationLinks = {
  name: string;
  props: Omit<
    LinkOptions,
    "children" | "className" | "activeProps" | "inactiveProps"
  >;
}[];

const defaultActiveOptions: LinkOptions["activeOptions"] = {
  exact: false,
  includeHash: false,
  includeSearch: false,
};

type Props = React.JSX.IntrinsicElements["nav"];

export const AppNavigation = (props: Props) => {
  const { className = "", ...navProps } = props;

  const [featureRowCount] = useFeature("DEFAULT_ROW_COUNT");
  const tableRowCount = React.useMemo(
    () => parseInt(featureRowCount || APP_DEFAULTS.tableRowCount, 10),
    [featureRowCount]
  );

  const links: AppNavigationLinks = [
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
        to: "/reports",
        activeOptions: defaultActiveOptions,
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
    <nav className={cn(className)} {...navProps}>
      <ul className="relative -mb-px flex space-x-5 overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:space-x-0.5 [&::-webkit-scrollbar]:hidden">
        {links.map((item, idx) => (
          <li key={`header_app_nav_${idx}`}>
            <Link
              {...item.props}
              className={cn(
                "inline-block whitespace-nowrap border-b pb-4 pt-3 leading-none transition-all sm:px-4",
                idx + 1 === links.length && "mr-4 sm:mr-0"
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
