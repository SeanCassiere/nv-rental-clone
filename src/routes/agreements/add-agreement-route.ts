import { lazy, Route } from "@tanstack/router";
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
  component: lazy(() => import("@/pages/add-agreement")),
});
