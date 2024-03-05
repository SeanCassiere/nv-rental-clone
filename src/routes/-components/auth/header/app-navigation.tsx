import React from "react";
import { Link, RegisteredRouter, type LinkProps } from "@tanstack/react-router";

import { useLocalStorage } from "@/lib/hooks/useLocalStorage";

import { STORAGE_DEFAULTS, STORAGE_KEYS } from "@/lib/utils/constants";

import { cn } from "@/lib/utils";

type AppNavigationLinks = {
  name: string;
  props: Omit<
    LinkProps<RegisteredRouter["routeTree"]>,
    "children" | "className" | "activeProps" | "inactiveProps"
  >;
}[];

const defaultActiveOptions: LinkProps["activeOptions"] = {
  exact: false,
  includeHash: false,
  includeSearch: false,
} as const;

type Props = React.ComponentPropsWithoutRef<"nav">;

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
          includeSearch: false,
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
          agreement_id: undefined,
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
        search: false,
      },
    },
    {
      name: "Settings",
      props: {
        to: "/settings",
        activeOptions: defaultActiveOptions,
        search: false,
      },
    },
  ] as const;

  return (
    <nav className={cn(className)} {...navProps}>
      <ul className="relative mx-auto -mb-px flex max-w-[1700px] space-x-5 overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:space-x-0.5 md:px-12 [&::-webkit-scrollbar]:hidden">
        {links.map((item, idx) => (
          <li key={`header_app_nav_${idx}`}>
            <Link
              {...item.props}
              className={cn(
                "inline-block whitespace-nowrap border-b py-4 leading-none transition-all sm:px-4"
              )}
              activeProps={{
                className: cn("border-foreground font-semibold"),
              }}
              inactiveProps={{
                className: cn("border-transparent hover:border-foreground/20"),
              }}
              params={true}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
