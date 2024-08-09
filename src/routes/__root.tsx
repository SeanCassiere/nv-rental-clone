import React from "react";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  ErrorComponent,
  Link,
  Outlet,
  rootRouteId,
  ScrollRestoration,
  useMatch,
  useRouter,
} from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import type { AuthContextProps } from "react-oidc-context";

import { RouterDevTools } from "@/components/router-devtools";
import { TailwindScreenDevTool } from "@/components/tailwind-screen-dev-tool";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";

import { titleMaker } from "@/lib/utils/title-maker";

import { cn } from "@/lib/utils";

import { Container } from "./-components/container";
import { FeatureTogglesDialog } from "./-components/feature-toggles-dialog";
import { PageNotFound } from "./-components/page-not-found";

export interface MyRouterContext {
  queryClient: QueryClient;
  auth: AuthContextProps;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: function RootComponent() {
    return (
      <RootDocument>
        <Outlet />
        <FeatureTogglesDialog />
      </RootDocument>
    );
  },
  errorComponent: function RootErrorComponent(props) {
    const { t } = useTranslation();

    const router = useRouter();
    const isRoot = useMatch({
      strict: false,
      select: (state) => state.id === rootRouteId,
    });

    useDocumentTitle(titleMaker(t("error", { ns: "messages" })));

    return (
      <RootDocument>
        <Container className="grid place-items-center px-2">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Error</CardTitle>
              <CardDescription>Something went wrong.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Button
                  onClick={() => {
                    router.invalidate();
                  }}
                  className=""
                >
                  Try Again
                </Button>
                {isRoot ? (
                  <Link
                    to="/"
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "bg-transparent"
                    )}
                  >
                    Go Home
                  </Link>
                ) : (
                  <Link
                    to="/"
                    className=""
                    onClick={(e) => {
                      e.preventDefault();
                      window.history.back();
                    }}
                  >
                    Go Back
                  </Link>
                )}
              </div>
              <ErrorComponent {...props} />
            </CardContent>
          </Card>
        </Container>
      </RootDocument>
    );
  },
  notFoundComponent: function RootNotFoundComponent() {
    const { t } = useTranslation();

    useDocumentTitle(titleMaker(t("notFound", { ns: "messages" })));

    return (
      <RootDocument>
        <Container className="flex">
          <PageNotFound className="px-2" />
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
      <TailwindScreenDevTool />
      <ReactQueryDevtools
        initialIsOpen={false}
        position="bottom"
        buttonPosition="top-left"
      />
      <RouterDevTools position="bottom-right" />
    </React.Fragment>
  );
}
