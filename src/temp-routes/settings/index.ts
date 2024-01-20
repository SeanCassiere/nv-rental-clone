import { Route } from "@tanstack/react-router";

import { Route } from "../../routes/__root";

export const settingsRoute = new Route({
  getParentRoute: () => Route,
  path: "settings",
});
