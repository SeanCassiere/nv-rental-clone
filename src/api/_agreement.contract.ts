import { z } from "zod";

import { c } from "@/api/c";
import {
  // PaginationSchema,
  StructuredErrorSchema,
  UserAndClientIdAuthSchema,
} from "./helpers";
import { AgreementDataSchema } from "@/schemas/agreement";

const rootAgreementContract = c.router({
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
