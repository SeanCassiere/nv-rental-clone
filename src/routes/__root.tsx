import React from "react";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { AuthContextProps } from "react-oidc-context";

import type { queryClient } from "@/lib/config/tanstack-query";

import { Container } from "./-components/container";
import { FeatureTogglesDialog } from "./-components/feature-toggles-dialog";
import { PageNotFound } from "./-components/page-not-found";
import { RouterDevTools } from "./-components/router-devtools";

export interface MyRouterContext {
  queryClient: typeof queryClient;
  auth: AuthContextProps;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Component,
  notFoundComponent: NotFoundComponent,
});

function Component() {
  return (
    <React.Fragment>
      <Outlet />
      <FeatureTogglesDialog />
      <RouterDevTools position="bottom-left" />
    </React.Fragment>
  );
}

function NotFoundComponent() {
  return (
    <Container className="flex">
      <PageNotFound renderRouterDevtools />
    </Container>
  );
}
