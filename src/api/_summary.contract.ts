import { c } from "@/api/c";

import {
  CalculateRentalSummaryInputSchema,
  RentalRatesSummarySchema,
} from "@/schemas/summary";

import {
  // PaginationSchema,
  StructuredErrorSchema,
  // UserAndClientIdAuthSchema,
} from "./helpers";

const rootSummaryContract = c.router({
  getLiveCalculationsForRental: {
    method: "POST",
    path: "/v3/summary",
    body: CalculateRentalSummaryInputSchema,
    responses: {
      200: RentalRatesSummarySchema,
      404: StructuredErrorSchema,
    },
  },
});

export { rootSummaryContract };
