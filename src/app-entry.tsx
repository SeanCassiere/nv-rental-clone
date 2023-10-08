import { Suspense, useRef } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Router, RouterProvider } from "@tanstack/react-router";
import CacheBuster, { useCacheBuster } from "react-cache-buster";
import { AuthProvider } from "react-oidc-context";

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

import { useEventListener } from "@/hooks/internal/useEventListener";

import { APP_VERSION, IS_LOCAL_DEV } from "./utils/constants";

export const router = new Router({
  routeTree,
  defaultPreload: "intent",
  parseSearch: parseSearchFn,
  stringifySearch: stringifySearchFn,
  defaultPendingComponent: LoadingPlaceholder,
  context: {
    apiClient,
    queryClient,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const App = () => {
  return (
    <CacheBuster
      isEnabled={!IS_LOCAL_DEV}
      currentVersion={APP_VERSION}
      isVerboseMode={IS_LOCAL_DEV}
      loadingComponent={<LoadingPlaceholder />}
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider {...reactOidcContextConfig}>
          <Suspense fallback={<LoadingPlaceholder />}>
            <CacheDocumentFocusChecker />
            <RouterProvider router={router} defaultPreload="intent" />
          </Suspense>
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
};

export default App;

const CacheDocumentFocusChecker = () => {
  const documentRef = useRef<Document>(document);

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
};
