import * as React from "react";
import type {
  AnyRouter,
  LinkComponentProps,
  LinkOptions,
  RegisteredRouter,
  RoutePaths,
} from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

import { cn } from "@/lib/utils";

export function SidebarNavigation({
  items,
}: {
  items: Array<() => React.JSX.Element>;
}) {
  return (
    <nav className="w-full">
      <ul className="grid gap-4 md:text-sm">
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
  TRouter extends AnyRouter = RegisteredRouter,
  TFrom extends RoutePaths<TRouter["routeTree"]> | string = string,
  TTo extends string = "",
  TMaskFrom extends RoutePaths<TRouter["routeTree"]> | string = TFrom,
  TMaskTo extends string = "",
>(
  props: LinkOptions<TRouter, TFrom, TTo, TMaskFrom, TMaskTo> &
    Omit<LinkComponentProps<"a">, "children"> & { children: React.ReactNode }
) {
  const { children, ...rest } = props;

  return (
    <Link
      className="py-2"
      activeProps={{
        className: cn("font-semibold text-foreground"),
      }}
      inactiveProps={{
        className: cn("text-muted-foreground hover:text-foreground"),
      }}
      {...(rest as any)}
    >
      {children}
    </Link>
  );
}
