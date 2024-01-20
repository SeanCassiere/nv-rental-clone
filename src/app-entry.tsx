import * as React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Router, RouterProvider } from "@tanstack/react-router";
import CacheBuster, { useCacheBuster } from "react-cache-buster";
import { I18nextProvider, useTranslation } from "react-i18next";
import { AuthProvider, useAuth } from "react-oidc-context";
import { Toaster } from "sonner";

import { LoadingPlaceholder } from "@/components/loading-placeholder";
import { notFoundRoute } from "@/components/not-found";
import { TailwindScreenDevTool } from "@/components/tailwind-screen-dev-tool";

import { useEventListener } from "@/hooks/useEventListener";
import { useTernaryDarkMode } from "@/hooks/useTernaryDarkMode";

import { APP_VERSION, IS_LOCAL_DEV } from "@/utils/constants";
import { parseSearchFn, stringifySearchFn } from "@/utils/router";

import { GlobalDialogProvider } from "@/context/modals";
import { reactOidcContextConfig } from "@/react-oidc-context-config";
import { routeTree } from "@/route-tree.gen";
import { queryClient } from "@/tanstack-query-config";

import i18n from "./i18next-config";

export const router = new Router({
  routeTree,
  notFoundRoute,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  parseSearch: parseSearchFn,
  stringifySearch: stringifySearchFn,
  defaultPendingComponent: LoadingPlaceholder,
  context: {
    queryClient,
    auth: undefined!, // will be set by an AuthWrapper
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <CacheBuster
      isEnabled={!IS_LOCAL_DEV}
      currentVersion={APP_VERSION}
      isVerboseMode={IS_LOCAL_DEV}
      loadingComponent={<LoadingPlaceholder />}
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider {...reactOidcContextConfig}>
          <React.Suspense fallback={<LoadingPlaceholder />}>
            <I18nextProvider i18n={i18n}>
              <GlobalDialogProvider>
                <CacheDocumentFocusChecker />
                <RouterWithAuth />
              </GlobalDialogProvider>
            </I18nextProvider>
          </React.Suspense>
          <ReactQueryDevtools
            initialIsOpen={false}
            position="bottom"
            buttonPosition="bottom-left"
          />
          <TailwindScreenDevTool />
        </AuthProvider>
      </QueryClientProvider>
    </CacheBuster>
  );
}

function RouterWithAuth() {
  const { i18n } = useTranslation();
  const auth = useAuth();
  const theme = useTernaryDarkMode();

  const dir = i18n.dir();

  return (
    <>
      <RouterProvider
        router={router}
        defaultPreload="intent"
        context={{ auth }}
      />
      <Toaster
        theme={theme.ternaryDarkMode}
        dir={dir}
        className="toaster group"
        toastOptions={{
          classNames: {
            toast:
              "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
            description: "group-[.toast]:text-muted-foreground",
            actionButton:
              "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
            cancelButton:
              "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          },
        }}
        richColors
        closeButton
      />
    </>
  );
}

function CacheDocumentFocusChecker() {
  const documentRef = React.useRef<Document>(document);

  const { checkCacheStatus } = useCacheBuster();

  const onVisibilityChange = () => {
    if (
      document.visibilityState === "visible" &&
      typeof checkCacheStatus === "function"
    ) {
      checkCacheStatus();
    }
  };

  useEventListener("visibilitychange", onVisibilityChange, documentRef);

  return null;
}
