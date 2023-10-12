import { lazyRouteComponent, Route } from "@tanstack/react-router";
import { z } from "zod";

import { reportQKeys } from "@/utils/query-key";

import { reportsRoute } from ".";

export const reportPathIdRoute = new Route({
  getParentRoute: () => reportsRoute,
  path: "$reportId",
  parseParams: (params) => ({
    reportId: z.string().parse(params.reportId),
  }),
  stringifyParams: (params) => ({
    reportId: `${params.reportId}`,
  }),
});

export const viewReportByIdRoute = new Route({
  getParentRoute: () => reportPathIdRoute,
  path: "/",
  loader: async ({ context: { queryClient, auth }, params: { reportId } }) => {
    const clientId = auth?.user?.profile?.navotar_clientid;
    const userId = auth?.user?.profile?.navotar_userid;

    if (clientId && userId) {
      const authParams = { clientId, userId };
      const promises: Promise<unknown>[] = [];

      // GET report details
      promises.push(
        queryClient.ensureQueryData(
          reportQKeys.getDetailsById({ auth: authParams, reportId })
        )
      );

      try {
        await Promise.all(promises);
      } catch (error) {
        console.log(
          "🚀 ~ file: report-id-route.ts:36 ~ loader: ~ error:",
          error
        );
      }
    }

    return {};
  },
}).update({
  component: lazyRouteComponent(() => import("@/pages/view-report")),
});
