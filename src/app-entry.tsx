import * as React from "react";
import { broadcastQueryClient } from "@tanstack/query-broadcast-client-experimental";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  createRouter,
  parseSearchWith,
  RouterProvider,
  stringifySearchWith,
} from "@tanstack/react-router";
import * as JSURL2 from "jsurl2";
import { useTranslation } from "react-i18next";
import { AuthProvider, useAuth } from "react-oidc-context";
import { Toaster } from "sonner";

import { CacheBuster, useCacheBuster } from "@/components/cache-buster";
import { icons } from "@/components/ui/icons";
import { TooltipProvider } from "@/components/ui/tooltip";

import { useEventListener } from "@/lib/hooks/useEventListener";
import { useTernaryDarkMode } from "@/lib/hooks/useTernaryDarkMode";
import { GlobalDialogProvider } from "@/lib/context/modals";

import { APP_VERSION, IS_DEV } from "@/lib/utils/constants";

import "@/lib/config/i18next";

import { userManager } from "@/lib/config/oidc-client-ts";
import { queryClient } from "@/lib/config/tanstack-query";

import { routeTree } from "@/route-tree.gen";

function CacheDocumentFocusChecker() {
  const documentRef = React.useRef<Document>(document);

  const { checkCacheStatus } = useCacheBuster();

  const onVisibilityChange = () => {
    if (document.visibilityState === "visible") {
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

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  defaultViewTransition: true,
  defaultPendingComponent: FullPageLoadingSpinner,
  parseSearch: parseSearchWith((value) => JSURL2.parse(value)),
  stringifySearch: stringifySearchWith(
    (value) => JSURL2.stringify(value),
    (value) => JSURL2.parse(value)
  ),
  context: {
    queryClient,
    auth: undefined!, // will be set by an AuthWrapper
  },
  trailingSlash: "never",
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

function RouterWithInjectedAuth() {
  const { i18n } = useTranslation();
  const auth = useAuth();
  const theme = useTernaryDarkMode();

  const dir = i18n.dir();

  React.useEffect(() => {
    if (typeof auth.user === "undefined") return;

    router.invalidate();
  }, [auth.user]);

  return (
    <React.Fragment>
      {typeof auth.user === "undefined" ? (
        <FullPageLoadingSpinner />
      ) : (
        <RouterProvider router={router} context={{ auth }} />
      )}
      <Toaster
        theme={theme.ternaryDarkMode}
        dir={dir}
        position="bottom-center"
        className="toaster group"
        toastOptions={{
          classNames: {
            toast:
              "group toast group-[.toaster]:bg-[var(--toast-background)] group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
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

export default function App() {
  return (
    <React.Suspense fallback={<FullPageLoadingSpinner />}>
      <CacheBuster
        loadingComponent={<FullPageLoadingSpinner />}
        currentVersion={APP_VERSION}
        isVerboseMode={IS_DEV}
        isEnabled={IS_DEV === false}
        reloadOnDowngrade
      >
        <QueryClientProvider client={queryClient}>
          <AuthProvider
            userManager={userManager}
            onSigninCallback={() => {
              queryClient.invalidateQueries();
            }}
          >
            <GlobalDialogProvider>
              <TooltipProvider>
                <CacheDocumentFocusChecker />
                <RouterWithInjectedAuth />
              </TooltipProvider>
            </GlobalDialogProvider>
          </AuthProvider>
        </QueryClientProvider>
      </CacheBuster>
    </React.Suspense>
  );
}
