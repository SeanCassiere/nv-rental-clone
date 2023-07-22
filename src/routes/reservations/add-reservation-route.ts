import { lazy, Route } from "@tanstack/router";
import { z } from "zod";

import { reservationsRoute } from ".";

export const addReservationRoute = new Route({
  getParentRoute: () => reservationsRoute,
  path: "new",
  validateSearch: (search) =>
    z
      .object({
        stage: z.string().optional(),
      })
      .parse(search),
  preSearchFilters: [() => ({ stage: "rental-information" })],
  component: lazy(() => import("../../pages/add-reservation")),
});
