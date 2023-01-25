import { lazy, Route } from "@tanstack/react-router";

import { rootRoute } from "./__root";

export const loggedOutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "logged-out",
  component: lazy(() => import("../pages/LoggedOut/LoggedOutPage")),
});
