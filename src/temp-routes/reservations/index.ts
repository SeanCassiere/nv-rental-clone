import { Route } from "@tanstack/react-router";

import { Route } from "../../routes/__root";

export const reservationsRoute = new Route({
  getParentRoute: () => Route,
  path: "reservations",
});
