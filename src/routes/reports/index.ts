import { Route } from "@tanstack/react-router";

import { rootRoute } from "@/routes/__root";

import { reportQKeys } from "@/utils/query-key";

export const reportsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "reports",
  loader: async ({ context: { auth, queryClient } }) => {
    const clientId = auth.user?.profile?.navotar_clientid || "";
    const userId = auth.user?.profile?.navotar_userid || "";

    if (auth.isAuthenticated && clientId && userId) {
      const promises: Promise<unknown>[] = [];

      // get reports list
      promises.push(
        queryClient.ensureQueryData(
          reportQKeys.getReports({ auth: { clientId, userId } })
        )
      );

      await Promise.all(promises);
    }
    return {};
  },
});
