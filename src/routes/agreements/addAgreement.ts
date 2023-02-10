import { lazy, Route } from "@tanstack/react-router";
import { z } from "zod";

import { agreementsRoute } from ".";
// import { queryClient as qc } from "../../App";

// import { getAuthToken } from "../../utils/authLocal";

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
  component: lazy(() => import("../../pages/AddAgreement/AddAgreementPage")),
});
