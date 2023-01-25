import { Route } from "@tanstack/react-router";

import { rootRoute } from "../__root";

export const customersRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "customers",
});
