import { lazyRouteComponent, Route } from "@tanstack/react-router";
import { z } from "zod";

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
}).update({
  component: lazyRouteComponent(() => import("@/pages/view-report")),
});
