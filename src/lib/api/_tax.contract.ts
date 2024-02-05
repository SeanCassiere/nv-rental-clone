import { z } from "zod";

import { c } from "@/lib/api/c";
import { TaxListSchema } from "@/lib/schemas/tax";

import { StructuredErrorSchema, UserAndClientIdAuthSchema } from "./helpers";

const rootTaxContract = c.router({
  getList: {
    method: "GET",
    path: "/v3/taxes",
    query: UserAndClientIdAuthSchema.extend({
      LocationId: z.string(),
      AgreementId: z.string().optional(),
    }),
    responses: {
      200: TaxListSchema,
      404: StructuredErrorSchema,
    },
  },
});

export { rootTaxContract };
