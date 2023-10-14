import * as React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Router, RouterProvider } from "@tanstack/react-router";
import CacheBuster, { useCacheBuster } from "react-cache-buster";
import { useTranslation } from "react-i18next";
import { AuthProvider, useAuth } from "react-oidc-context";
import { Toaster } from "sonner";

import { LoadingPlaceholder } from "@/components/loading-placeholder";
import { TailwindScreenDevTool } from "@/components/tailwind-screen-dev-tool";

import { apiClient } from "@/api";
import { reactOidcContextConfig } from "@/react-oidc-context-config";
import { queryClient } from "@/tanstack-query-config";
import {
  parseSearchFn,
  routeTree,
  stringifySearchFn,
} from "@/tanstack-router-config";

import "./i18next-config";

import { GlobalDialogProvider } from "@/hooks/context/modals";
import { useEventListener } from "@/hooks/internal/useEventListener";
import { useTernaryDarkMode } from "@/hooks/internal/useTernaryDarkMode";

import { APP_VERSION, IS_LOCAL_DEV } from "@/utils/constants";

export const router = new Router({
  routeTree,
  defaultPreload: "intent",
  parseSearch: parseSearchFn,
  stringifySearch: stringifySearchFn,
  defaultPendingComponent: LoadingPlaceholder,
  context: {
    apiClient,
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
          <GlobalDialogProvider>
            <React.Suspense fallback={<LoadingPlaceholder />}>
              <CacheDocumentFocusChecker />
              <RouterWithAuth />
            </React.Suspense>
          </GlobalDialogProvider>
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
      <Toaster theme={theme.ternaryDarkMode} dir={dir} closeButton richColors />
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
