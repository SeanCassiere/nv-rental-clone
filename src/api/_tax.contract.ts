import { z } from "zod";

import { c } from "@/api/c";
import { StructuredErrorSchema, UserAndClientIdAuthSchema } from "./helpers";
import { TaxListSchema } from "@/schemas/tax";

const rootTaxContract = c.router({
  getTaxes: {
    method: "GET",
    path: "/v3/taxes",
    query: UserAndClientIdAuthSchema.extend({
      LocationId: z.string(),
    }),
    responses: {
      200: TaxListSchema,
      404: StructuredErrorSchema,
    },
  },
});

export { rootTaxContract };
