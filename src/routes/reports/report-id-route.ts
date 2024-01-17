import { lazyRouteComponent, Route } from "@tanstack/react-router";
import { z } from "zod";

import { getAuthFromRouterContext } from "@/utils/auth";
import { fetchReportByIdOptions } from "@/utils/query/report";

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
  beforeLoad: ({ context, params: { reportId } }) => {
    const auth = getAuthFromRouterContext(context);
    return {
      authParams: auth,
      searchReportByIdOptions: fetchReportByIdOptions({ auth, reportId }),
    };
  },
  loader: async ({ context }) => {
    const { queryClient, searchReportByIdOptions } = context;

    await queryClient.ensureQueryData(searchReportByIdOptions);

    return;
  },
  component: lazyRouteComponent(() => import("@/pages/view-report")),
});
