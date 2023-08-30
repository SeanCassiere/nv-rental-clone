import { z } from "zod";

import { c } from "@/api/c";

import {
  CalculateRentalSummaryInputSchema,
  RentalRatesSummarySchema,
} from "@/schemas/summary";

import {
  StructuredErrorSchema,
  UnauthorizedErrorSchema,
  UserAndClientIdAuthSchema,
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
  getSummaryForReferenceId: {
    method: "GET",
    path: "/v3/:referenceType/:referenceId/summary",
    pathParams: z.object({
      referenceType: z.enum(["reservations", "agreements"]),
      referenceId: z.string(),
    }),
    query: UserAndClientIdAuthSchema,
    responses: {
      200: RentalRatesSummarySchema,
      400: StructuredErrorSchema,
      500: StructuredErrorSchema,
      401: UnauthorizedErrorSchema,
    },
  },
});

export { rootSummaryContract };
