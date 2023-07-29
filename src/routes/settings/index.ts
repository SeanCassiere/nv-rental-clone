import { Route } from "@tanstack/router";

import { rootRoute } from "../__root";

export const settingsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "settings",
});
