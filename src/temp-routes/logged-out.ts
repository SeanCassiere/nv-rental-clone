import { lazyRouteComponent, Route } from "@tanstack/react-router";

import { Route } from "../routes/__root";

export const loggedOutRoute = new Route({
  getParentRoute: () => Route,
  path: "logged-out",
  component: lazyRouteComponent(() => import("@/pages/logged-out")),
});
