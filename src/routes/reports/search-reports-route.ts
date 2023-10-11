import { lazyRouteComponent, Route } from "@tanstack/react-router";

import { getAuthToken } from "@/utils/authLocal";
import { reportQKeys } from "@/utils/query-key";

import { reportsRoute } from ".";

export const searchReportsRoute = new Route({
  getParentRoute: () => reportsRoute,
  path: "/",
  loader: async ({ context: { queryClient } }) => {
    const auth = getAuthToken();

    if (auth) {
      const clientId = auth.profile.navotar_clientid;
      const userId = auth.profile.navotar_userid;

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
}).update({
  component: lazyRouteComponent(() => import("@/pages/search-reports")),
});
