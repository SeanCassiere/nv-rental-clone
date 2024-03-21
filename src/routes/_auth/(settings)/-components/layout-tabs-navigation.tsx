import {
  Link,
  type AnyRoute,
  type LinkProps,
  type RegisteredRouter,
  type RoutePaths,
  type ToPathOption,
} from "@tanstack/react-router";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function LayoutTabsNavigation(props: {
  items: (() => JSX.Element)[];
  currentPathname: string;
  className?: string;
}) {
  return (
    <Tabs value={props.currentPathname} className={props.className}>
      <TabsList className="w-full lg:max-w-max">
        {props.items.map((Item, idx) => {
          return <Item key={`settings_tabs_nav_${idx}`} />;
        })}
      </TabsList>
    </Tabs>
  );
}

export function LayoutTabNavigationItem<
  TRouteTree extends AnyRoute = RegisteredRouter["routeTree"],
  TFrom extends RoutePaths<TRouteTree> | string = string,
  TTo extends string = "",
  TMaskFrom extends RoutePaths<TRouteTree> | string = TFrom,
  TMaskTo extends string = "",
>(props: {
  pathname: ToPathOption<TRouteTree, TFrom, TTo>;
  children: React.ReactNode;
  linkProps: Omit<
    React.PropsWithoutRef<
      LinkProps<TRouteTree, TFrom, TTo, TMaskFrom, TMaskTo> &
        Omit<React.ComponentPropsWithoutRef<"a">, "children" | "preload">
    >,
    "className" | "activeProps" | "inactiveProps" | "children"
  >;
}) {
  return (
    <TabsTrigger value={props.pathname} asChild>
      <Link {...props.linkProps}>{props.children}</Link>
    </TabsTrigger>
  );
}
