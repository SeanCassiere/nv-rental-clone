import { Route } from "@tanstack/react-router";

import { LoadingPlaceholder } from "@/components/loading-placeholder";

import { localStoragePersister } from "@/tanstack-query-config";

import { rootRoute } from "./__root";

export const logoutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "logout",
  loader: async ({ context, preload, navigate }) => {
    if (preload) return;

    const { auth } = context;

    if (!auth.isAuthenticated) {
      await navigate({
        to: "/logged-out",
      });
    }

    if (typeof window !== "undefined") {
      localStoragePersister.removeClient();

      const localStorageKeyPrefix = `app-runtime:`;
      Object.keys(window.localStorage)
        .filter((key) => key.startsWith(localStorageKeyPrefix))
        .forEach((key) => window.localStorage.removeItem(key));
    }

    await auth.signoutRedirect();

    return;
  },
  component: LoadingPlaceholder,
});
