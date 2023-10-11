import { lazyRouteComponent, Route } from "@tanstack/react-router";

import { getAuthToken } from "@/utils/authLocal";

import { reportsRoute } from ".";

export const searchReportsRoute = new Route({
  getParentRoute: () => reportsRoute,
  path: "/",
  loader: async ({ context: { queryClient } }) => {
    const auth = getAuthToken();

    if (auth) {
      const promises: Promise<unknown>[] = [];

      // get columns
      // const columnsKey = reservationQKeys.columns();
      // promises.push(
      //   queryClient.ensureQueryData({
      //     queryKey: columnsKey,
      //     queryFn: () =>
      //       fetchModuleColumnsModded({
      //         query: {
      //           clientId: auth.profile.navotar_clientid,
      //           userId: auth.profile.navotar_userid,
      //           module: "reservation",
      //         },
      //       }),
      //   })
      // );
      await Promise.all(promises);
    }
    return {};
  },
}).update({
  component: lazyRouteComponent(() => import("@/pages/search-reports")),
});
