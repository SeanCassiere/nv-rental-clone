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
      <ul className="flex flex-col space-y-1.5">
        {items.map((Item, idx) => {
          return (
            <li className="w-full" key={`settings_sidebar_${idx}`}>
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
      className={cn(
        "flex h-10 items-center justify-start rounded-md border px-3 text-sm font-medium underline-offset-2"
      )}
      activeProps={{
        className: cn("border-border bg-muted text-foreground underline"),
      }}
      inactiveProps={{
        className: cn(
          "border-transparent text-muted-foreground hover:bg-muted/90 hover:text-foreground hover:underline"
        ),
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
