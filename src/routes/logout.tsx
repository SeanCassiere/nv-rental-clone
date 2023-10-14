import { Route } from "@tanstack/react-router";

import { LoadingPlaceholder } from "@/components/loading-placeholder";

import { removeAllLocalStorageKeysForUser } from "@/utils/user-local-storage";

import { router } from "@/app-entry";

import { rootRoute } from "./__root";

export const logoutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "logout",
  loader: async ({ context, preload }) => {
    if (preload) return {};

    const { auth } = context;

    if (!auth.isAuthenticated) {
      router.navigate({ to: "/logged-out" });
    }

    const clientId = auth.user?.profile.navotar_clientid || "";
    const userId = auth.user?.profile.navotar_userid || "";

    if (clientId && userId) {
      removeAllLocalStorageKeysForUser(clientId, userId);
    }

    await auth.signoutRedirect();

    return {};
  },
  component: LoadingPlaceholder,
});
