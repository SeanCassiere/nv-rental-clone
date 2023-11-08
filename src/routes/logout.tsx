import { redirect, Route } from "@tanstack/react-router";

import { LoadingPlaceholder } from "@/components/loading-placeholder";

import { removeAllLocalStorageKeysForUser } from "@/utils/user-local-storage";

import { rootRoute } from "./__root";

export const logoutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "logout",
  load: async ({ context, preload }) => {
    if (preload) return {};

    const { auth } = context;

    if (!auth.isAuthenticated) {
      // router.navigate({ to: "/logged-out" });
      throw redirect({
        to: "/logged-out",
      });
    }

    const clientId = auth.user?.profile.navotar_clientid || "";
    const userId = auth.user?.profile.navotar_userid || "";

    if (clientId && userId) {
      removeAllLocalStorageKeysForUser(clientId, userId);
    }

    await auth.signoutRedirect();

    return;
  },
  component: LoadingPlaceholder,
});
