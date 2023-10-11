import { z } from "zod";

import { c } from "@/api/c";

import {
  AgreementDataSchema,
  AgreementListItemListSchema,
  AgreementStatusListSchema,
  AgreementTypeArraySchema,
  GenerateAgreementNumberSchema,
} from "@/schemas/agreement";

import {
  PaginationSchema,
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
  getList: {
    method: "GET",
    path: "/v3/agreements",
    query: UserAndClientIdAuthSchema.merge(PaginationSchema).extend({
      currentDate: z.string(),
      AgreementStatusName: z.string().optional(),
      Statuses: z.array(z.string()).optional(),
      IsSearchOverdues: z.string().optional(),
      StartDate: z.string().optional(),
      EndDate: z.string().optional(),
      SortBy: z.string().optional(),
      SortDirection: z.string().optional(),
      CustomerId: z.string().optional(),
      VehicleId: z.string().optional(),
      VehicleNo: z.string().optional(),
      VehicleTypeId: z.string().optional(),
      PickupLocationId: z.string().optional(),
      ReturnLocationId: z.string().optional(),
      AgreementTypes: z.string().optional(),
      Keyword: z.string().optional(),
      AgreementNumber: z.string().optional(),
    }),
    responses: {
      200: AgreementListItemListSchema,
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
