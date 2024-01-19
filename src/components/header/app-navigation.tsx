import React from "react";
import { Link, type LinkOptions } from "@tanstack/react-router";

import { useLocalStorage } from "@/hooks/useLocalStorage";

import { STORAGE_DEFAULTS, STORAGE_KEYS } from "@/utils/constants";

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
} as const;

type Props = React.JSX.IntrinsicElements["nav"];

export const AppNavigation = (props: Props) => {
  const { className = "", ...navProps } = props;

  const [tableRowCountStr] = useLocalStorage(
    STORAGE_KEYS.tableRowCount,
    STORAGE_DEFAULTS.tableRowCount
  );
  const tableRowCount = React.useMemo(
    () => parseInt(tableRowCountStr, 10),
    [tableRowCountStr]
  );

  const links: AppNavigationLinks = [
    {
      name: "Dashboard",
      props: {
        to: "/",
        activeOptions: {
          exact: true,
        },
        params: false,
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
        params: false,
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
        params: false,
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
        params: false,
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
        params: false,
      },
    },
    {
      name: "Reports",
      props: {
        to: "/reports",
        activeOptions: defaultActiveOptions,
        params: false,
      },
    },
    {
      name: "Settings",
      props: {
        to: "/settings",
        activeOptions: defaultActiveOptions,
        params: false,
      },
    },
  ];

  return (
    <nav className={cn(className)} {...navProps}>
      <ul className="relative mx-auto -mb-px flex max-w-[1700px] space-x-5 overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:space-x-0.5 md:px-12 [&::-webkit-scrollbar]:hidden">
        {links.map((item, idx) => (
          <li key={`header_app_nav_${idx}`}>
            <Link
              {...item.props}
              className={cn(
                "inline-block whitespace-nowrap border-b pb-4 pt-3 leading-none transition-all sm:px-4"
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
