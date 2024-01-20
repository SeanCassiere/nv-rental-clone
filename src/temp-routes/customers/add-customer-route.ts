import { Route } from "@tanstack/react-router";

import { customersRoute } from ".";

export const addCustomerRoute = new Route({
  getParentRoute: () => customersRoute,
  path: "new",
  component: () => "Add Customer Route",
});
