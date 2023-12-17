import { lazyRouteComponent, Route } from "@tanstack/react-router";

import { rootRoute } from "./__root";

export const loggedOutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "logged-out",
  component: lazyRouteComponent(() => import("@/pages/logged-out")),
});
