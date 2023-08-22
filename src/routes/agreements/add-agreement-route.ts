import { lazyRouteComponent, Route } from "@tanstack/react-router";
import { z } from "zod";

import { agreementsRoute } from ".";

export const addAgreementRoute = new Route({
  getParentRoute: () => agreementsRoute,
  path: "new",
  validateSearch: (search) =>
    z
      .object({
        stage: z.string().optional(),
      })
      .parse(search),
  preSearchFilters: [() => ({ stage: "rental-information" })],
}).update({
  component: lazyRouteComponent(() => import("@/pages/add-agreement")),
});
