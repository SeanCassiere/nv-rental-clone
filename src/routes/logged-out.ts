import { lazy } from "@tanstack/react-router";

import { rootRoute } from "./__root";

export const loggedOutRoute = rootRoute.createRoute({
  path: "logged-out",
  component: lazy(() => import("../pages/LoggedOut/LoggedOutPage")),
});
