import { Route } from "@tanstack/react-router";

import { Route } from "@/routes/__root";

export const reportsRoute = new Route({
  getParentRoute: () => Route,
  path: "reports",
});
