import React from "react";
import {
  createRootRouteWithContext,
  ErrorComponent,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";
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
  component: RootComponent,
  notFoundComponent: RootNotFoundComponent,
  errorComponent: function RootErrorComponent(props) {
    return (
      <RootDocument>
        <Container>
          <ErrorComponent {...props} />
        </Container>
      </RootDocument>
    );
  },
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      {children}
      <ScrollRestoration />
      <RouterDevTools position="bottom-left" />
    </React.Fragment>
  );
}

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
      <FeatureTogglesDialog />
    </RootDocument>
  );
}

function RootNotFoundComponent() {
  const { t } = useTranslation();

  useDocumentTitle(titleMaker(t("notFound", { ns: "messages" })));

  return (
    <RootDocument>
      <Container className="flex">
        <PageNotFound className="px-2" />
      </Container>
    </RootDocument>
  );
}
