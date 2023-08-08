import { z } from "zod";

import { c } from "@/api/c";
import {
  // PaginationSchema,
  StructuredErrorSchema,
  UserAndClientIdAuthSchema,
} from "./helpers";
import {
  AgreementDataSchema,
  AgreementStatusListSchema,
  AgreementTypeArraySchema,
  GenerateAgreementNumberSchema,
} from "@/schemas/agreement";

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
  getAgreementStatuses: {
    method: "GET",
    path: "/v3/agreements/statuses",
    query: UserAndClientIdAuthSchema,
    responses: {
      200: AgreementStatusListSchema,
    },
  },
  getAgreementTypes: {
    method: "GET",
    path: "/v3/agreements/types",
    query: UserAndClientIdAuthSchema,
    responses: {
      200: AgreementTypeArraySchema,
    },
  },
  getNewAgreementNumber: {
    method: "GET",
    path: "/v3/agreements/generateagreementno",
    query: UserAndClientIdAuthSchema.extend({
      agreementType: z.string(),
    }),
    responses: {
      200: GenerateAgreementNumberSchema,
    },
  },
});

export { rootAgreementContract };
