import { Route } from "@tanstack/react-router";

import { Route } from "../../routes/__root";

export const customersRoute = new Route({
  getParentRoute: () => Route,
  path: "customers",
});
