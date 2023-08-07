import { z } from "zod";

import { c } from "@/api/c";
import {
  PaginationSchema,
  StructuredErrorSchema,
  UserAndClientIdAuthSchema,
} from "./helpers";
import {
  AgreementDataSchema,
  AgreementListItemListSchema,
} from "@/schemas/agreement";

const rootAgreementContract = c.router({
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
  getAgreementById: {
    method: "GET",
    path: "/v3/agreements/:agreementId",
    query: UserAndClientIdAuthSchema,
    responses: {
      200: AgreementDataSchema,
      404: StructuredErrorSchema,
    },
  },
});

export { rootAgreementContract };
