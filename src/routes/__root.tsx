import React from "react";
import { Outlet, rootRouteWithContext } from "@tanstack/react-router";
import type { AuthContextProps } from "react-oidc-context";

import { IS_DEV } from "@/utils/constants";

import type { queryClient } from "@/tanstack-query-config";

export interface MyRouterContext {
  queryClient: typeof queryClient;
  auth: AuthContextProps;
}

const routerRootWithContext = rootRouteWithContext<MyRouterContext>();

export const Route = routerRootWithContext({
  component: RootComponent,
});

const RouterDevTools = IS_DEV
  ? React.lazy(() =>
      import("@tanstack/router-devtools").then((res) => ({
        default: res.TanStackRouterDevtools,
      }))
    )
  : () => null;

function RootComponent() {
  return (
    <React.Fragment>
      <Outlet />
      <RouterDevTools position="top-right" />
    </React.Fragment>
  );
}
