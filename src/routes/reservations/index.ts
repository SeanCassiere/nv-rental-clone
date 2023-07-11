import { Route } from "@tanstack/router";

import { rootRoute } from "../__root";

export const reservationsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "reservations",
});
