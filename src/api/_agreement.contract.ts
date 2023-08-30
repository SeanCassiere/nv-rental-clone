import { z } from "zod";

import { c } from "@/api/c";

import {
  AgreementDataSchema,
  AgreementStatusListSchema,
  AgreementTypeArraySchema,
  GenerateAgreementNumberSchema,
} from "@/schemas/agreement";

import {
  // PaginationSchema,
  StructuredErrorSchema,
  UserAndClientIdAuthSchema,
} from "./helpers";

const rootAgreementContract = c.router({
  getById: {
    method: "GET",
    path: "/v3/agreements/:agreementId",
    query: UserAndClientIdAuthSchema,
    responses: {
      200: AgreementDataSchema,
      404: StructuredErrorSchema,
    },
  },
  getStatuses: {
    method: "GET",
    path: "/v3/agreements/statuses",
    query: UserAndClientIdAuthSchema,
    responses: {
      200: AgreementStatusListSchema,
    },
  },
  getTypes: {
    method: "GET",
    path: "/v3/agreements/types",
    query: UserAndClientIdAuthSchema,
    responses: {
      200: AgreementTypeArraySchema,
    },
  },
  generateNewNumber: {
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
