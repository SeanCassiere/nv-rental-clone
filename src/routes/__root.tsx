import React from "react";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { AuthContextProps } from "react-oidc-context";

import { IS_DEV } from "@/lib/utils/constants";

import type { queryClient } from "@/lib/config/tanstack-query";

import { FeatureTogglesDialog } from "./-components/feature-toggles-dialog";

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
      <FeatureTogglesDialog />
      <RouterDevTools position="bottom-left" />
    </React.Fragment>
  );
}
