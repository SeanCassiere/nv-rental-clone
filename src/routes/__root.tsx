import React from "react";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { AuthContextProps } from "react-oidc-context";

import { IS_DEV } from "@/utils/constants";

import type { queryClient } from "@/tanstack-query-config";

export interface MyRouterContext {
  queryClient: typeof queryClient;
  auth: AuthContextProps;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
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
