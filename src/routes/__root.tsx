import React from "react";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import type { AuthContextProps } from "react-oidc-context";

import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";

import { titleMaker } from "@/lib/utils/title-maker";

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

function RootComponent({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      {children}
      <RouterDevTools position="bottom-left" />
    </React.Fragment>
  );
}

function Component() {
  return (
    <RootComponent>
      <Outlet />
      <FeatureTogglesDialog />
    </RootComponent>
  );
}

function NotFoundComponent() {
  const { t } = useTranslation();

  useDocumentTitle(titleMaker(t("notFound", { ns: "messages" })));

  return (
    <RootComponent>
      <Container className="flex">
        <PageNotFound className="px-2" />
      </Container>
    </RootComponent>
  );
}
