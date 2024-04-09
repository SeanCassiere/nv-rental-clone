import React from "react";
import {
  Link,
  type AnyRoute,
  type LinkProps,
  type RegisteredRouter,
  type RoutePaths,
} from "@tanstack/react-router";

import { useLocalStorage } from "@/lib/hooks/useLocalStorage";

import { STORAGE_DEFAULTS, STORAGE_KEYS } from "@/lib/utils/constants";

import { cn } from "@/lib/utils";

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

  return (
    <nav className={cn(className)} {...navProps}>
      <ul className="relative mx-auto -mb-px flex max-w-[1700px] space-x-5 overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:space-x-0.5 md:px-12 [&::-webkit-scrollbar]:hidden">
        <AppNavigationLink
          name="Dashboard"
          props={{
            to: "/",
            activeOptions: {
              exact: true,
              includeSearch: false,
            },
          }}
        />
        <AppNavigationLink
          name="Fleet"
          props={{
            to: "/fleet",
            search: (current) => ({
              ...current,
              page: 1,
              size: tableRowCount,
              filters: undefined,
            }),
            activeOptions: defaultActiveOptions,
          }}
        />
        <AppNavigationLink
          name="Customers"
          props={{
            to: "/customers",
            search: (current) => ({
              ...current,
              page: 1,
              size: tableRowCount,
              filters: undefined,
            }),
            activeOptions: defaultActiveOptions,
          }}
        />
        <AppNavigationLink
          name="Reservations"
          props={{
            to: "/reservations",
            search: (current) => ({
              ...current,
              page: 1,
              size: tableRowCount,
              filters: undefined,
            }),
            activeOptions: defaultActiveOptions,
          }}
        />
        <AppNavigationLink
          name="Agreements"
          props={{
            to: "/agreements",
            search: (current) => ({
              ...current,
              page: 1,
              size: tableRowCount,
              filters: undefined,
            }),
            activeOptions: defaultActiveOptions,
          }}
        />
        <AppNavigationLink
          name="Reports"
          props={{
            to: "/reports",
            activeOptions: defaultActiveOptions,
          }}
        />
        <AppNavigationLink
          name="Settings"
          props={{
            to: "/settings",
            activeOptions: defaultActiveOptions,
          }}
        />
      </ul>
    </nav>
  );
};

const AppNavigationLink = <
  TRouteTree extends AnyRoute = RegisteredRouter["routeTree"],
  TFrom extends RoutePaths<TRouteTree> | string = string,
  TTo extends string = "",
  TMaskFrom extends RoutePaths<TRouteTree> | string = TFrom,
  TMaskTo extends string = "",
>(props: {
  name: string;
  props: Omit<
    React.PropsWithoutRef<
      LinkProps<TRouteTree, TFrom, TTo, TMaskFrom, TMaskTo> &
        Omit<React.ComponentPropsWithoutRef<"a">, "preload">
    >,
    "children" | "className" | "activeProps" | "inactiveProps"
  >;
}) => {
  const { name, props: linkProps } = props;
  return (
    <li>
      <Link
        className={cn(
          "inline-block whitespace-nowrap border-b py-4 leading-none transition-all sm:px-4"
        )}
        activeProps={{
          className: cn("border-foreground font-semibold"),
        }}
        inactiveProps={{
          className: cn("border-transparent hover:border-foreground/20"),
        }}
        {...linkProps}
      >
        {name}
      </Link>
    </li>
  );
};
