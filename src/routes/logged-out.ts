import { Route, lazyRouteComponent } from "@tanstack/router";

import { rootRoute } from "./__root";

export const loggedOutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "logged-out",
}).update({
  component: lazyRouteComponent(() => import("@/pages/logged-out")),
});
