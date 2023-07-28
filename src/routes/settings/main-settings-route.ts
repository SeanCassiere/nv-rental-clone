import { Route } from "@tanstack/router";

import { settingsRoute } from ".";

export const mainSettingsRoute = new Route({
  getParentRoute: () => settingsRoute,
  path: "/",
  component: () => "Settings page",
});
