import { Navigate, Route } from "@tanstack/router";

import { settingsRoute } from ".";

export const mainSettingsRoute = new Route({
  getParentRoute: () => settingsRoute,
  path: "/",
  component: () => (
    <Navigate to="/settings/$destination" params={{ destination: "profile" }} />
  ),
});
