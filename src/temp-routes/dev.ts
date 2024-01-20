import { lazyRouteComponent, Route } from "@tanstack/react-router";

import { Route } from "../routes/__root";

export const devRoute = new Route({
  getParentRoute: () => Route,
  path: "dev",
  component: lazyRouteComponent(() => import("@/pages/dev")),
});
