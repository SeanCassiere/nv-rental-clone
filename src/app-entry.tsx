import * as React from "react";
import { broadcastQueryClient } from "@tanstack/query-broadcast-client-experimental";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import CacheBuster, { useCacheBuster } from "react-cache-buster";
import { I18nextProvider, useTranslation } from "react-i18next";
import { AuthProvider, useAuth } from "react-oidc-context";
import { Toaster } from "sonner";

import { TailwindScreenDevTool } from "@/components/tailwind-screen-dev-tool";
import { icons } from "@/components/ui/icons";
import { TooltipProvider } from "@/components/ui/tooltip";

import { useEventListener } from "@/lib/hooks/useEventListener";
import { useTernaryDarkMode } from "@/lib/hooks/useTernaryDarkMode";
import { GlobalDialogProvider } from "@/lib/context/modals";

import { APP_VERSION, IS_DEV } from "@/lib/utils/constants";
import { parseSearchFn, stringifySearchFn } from "@/lib/utils/router";

import i18nextConfig from "@/lib/config/i18next";
import { reactOidcContextConfig } from "@/lib/config/react-oidc-context";
import { queryClient } from "@/lib/config/tanstack-query";

import { routeTree } from "@/route-tree.gen";

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  parseSearch: parseSearchFn,
  stringifySearch: stringifySearchFn,
  defaultPendingComponent: FullPageLoadingSpinner,
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

broadcastQueryClient({
  queryClient,
  broadcastChannel: APP_VERSION,
});

export default function App() {
  return (
    <CacheBuster
      loadingComponent={<FullPageLoadingSpinner />}
      currentVersion={APP_VERSION}
      isVerboseMode={IS_DEV}
      isEnabled={IS_DEV === false}
      reloadOnDowngrade
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider {...reactOidcContextConfig}>
          <React.Suspense fallback={<FullPageLoadingSpinner />}>
            <I18nextProvider i18n={i18nextConfig}>
              <GlobalDialogProvider>
                <TooltipProvider>
                  <CacheDocumentFocusChecker />
                  <RouterWithInjectedAuth />
                </TooltipProvider>
              </GlobalDialogProvider>
            </I18nextProvider>
          </React.Suspense>
          <ReactQueryDevtools
            initialIsOpen={false}
            position="bottom"
            buttonPosition="top-left"
          />
          <TailwindScreenDevTool />
        </AuthProvider>
      </QueryClientProvider>
    </CacheBuster>
  );
}

function RouterWithInjectedAuth() {
  const { i18n } = useTranslation();
  const auth = useAuth();
  const theme = useTernaryDarkMode();

  const dir = i18n.dir();

  return (
    <React.Fragment>
      {auth.isLoading ? (
        <FullPageLoadingSpinner />
      ) : (
        <RouterProvider
          router={router}
          defaultPreload="intent"
          context={{ auth }}
        />
      )}
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
        closeButton
      />
    </React.Fragment>
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

function FullPageLoadingSpinner() {
  return (
    <div className="grid min-h-dvh place-items-center bg-background">
      <icons.Loading className="h-24 w-24 animate-spin text-foreground" />
    </div>
  );
}
