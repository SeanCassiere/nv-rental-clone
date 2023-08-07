import { z } from "zod";
import { initContract } from "@ts-rest/core";

import {
  UserAndClientIdAuthSchema,
  StructuredErrorSchema,
  PaginationSchema,
} from "@/api/api.helpers";

import { AgreementListItemListSchema } from "@/schemas/agreement";

const c = initContract();

const contract = c.router({
  getAgreementsList: {
    method: "GET",
    path: "/v3/agreements",
    query: PaginationSchema.merge(UserAndClientIdAuthSchema).extend({
      currentDate: z.string(),
    }),
    responses: {
      200: AgreementListItemListSchema,
      404: StructuredErrorSchema,
    },
  },
});

export { contract };
