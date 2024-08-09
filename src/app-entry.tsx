import * as React from "react";
import { RouterProvider } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { AuthProvider, useAuth } from "react-oidc-context";
import { Toaster } from "sonner";

import { CacheBuster } from "@/components/cache-buster";
import { icons } from "@/components/ui/icons";

import { useTernaryDarkMode } from "@/lib/hooks/useTernaryDarkMode";

import { APP_VERSION, IS_DEV } from "@/lib/utils/constants";

import "@/lib/config/i18next";

import { userManager } from "@/lib/config/oidc-client-ts";
import { createRouter } from "@/lib/config/tanstack-router";

function FullPageLoadingSpinner() {
  return (
    <div className="grid min-h-dvh place-items-center bg-background">
      <icons.Loading className="h-24 w-24 animate-spin text-foreground" />
    </div>
  );
}

const router = createRouter();

function InnerApp() {
  const auth = useAuth();

  React.useEffect(() => {
    if (typeof auth.user === "undefined") return;

    router.invalidate();
  }, [auth.user]);

  return typeof auth.user === "undefined" ? (
    <FullPageLoadingSpinner />
  ) : (
    <RouterProvider router={router} context={{ auth }} />
  );
}

export default function App() {
  const { i18n } = useTranslation();
  const theme = useTernaryDarkMode();

  const dir = i18n.dir();

  return (
    <React.Suspense fallback={<FullPageLoadingSpinner />}>
      <CacheBuster
        loadingComponent={<FullPageLoadingSpinner />}
        currentVersion={APP_VERSION}
        isVerboseMode={IS_DEV}
        isEnabled={IS_DEV === false}
        reloadOnDowngrade
      >
        <AuthProvider userManager={userManager}>
          <InnerApp />
        </AuthProvider>
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
      </CacheBuster>
    </React.Suspense>
  );
}
