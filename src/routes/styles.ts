import { lazyRouteComponent, Route } from "@tanstack/router";

import { rootRoute } from "./__root";

export const stylingRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "styles",
}).update({
  component: lazyRouteComponent(() => import("@/pages/styling-playground")),
});
