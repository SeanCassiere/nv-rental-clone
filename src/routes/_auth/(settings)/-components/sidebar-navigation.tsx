import React from "react";
import {
  Link,
  type AnyRoute,
  type LinkProps,
  type RegisteredRouter,
  type RoutePaths,
} from "@tanstack/react-router";

import { cn } from "@/lib/utils";

export function SidebarNavigation({ items }: { items: (() => JSX.Element)[] }) {
  return (
    <nav className="w-full">
      <ul className="grid gap-4 text-muted-foreground hover:text-foreground md:text-sm">
        {items.map((Item, idx) => {
          return (
            <li key={`settings_sidebar_${idx}`}>
              <Item />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function SidebarNavigationItem<
  TRouteTree extends AnyRoute = RegisteredRouter["routeTree"],
  TFrom extends RoutePaths<TRouteTree> | string = string,
  TTo extends string = "",
  TMaskFrom extends RoutePaths<TRouteTree> | string = TFrom,
  TMaskTo extends string = "",
>(
  props: Omit<
    React.PropsWithoutRef<
      LinkProps<TRouteTree, TFrom, TTo, TMaskFrom, TMaskTo> &
        Omit<React.ComponentPropsWithoutRef<"a">, "children" | "preload">
    >,
    "className" | "activeProps" | "inactiveProps" | "children"
  > & { children: React.ReactNode }
) {
  const { children, ...rest } = props;

  return (
    <Link
      className="py-2"
      activeProps={{
        className: cn("font-semibold text-foreground"),
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
