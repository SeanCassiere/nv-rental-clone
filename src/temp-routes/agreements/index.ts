import { Route } from "@tanstack/react-router";

import { Route } from "../../routes/__root";

export const agreementsRoute = new Route({
  getParentRoute: () => Route,
  path: "agreements",
});
