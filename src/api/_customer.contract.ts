import { c } from "@/api/c";

import {
  CustomerDataSchema,
  CustomerTypeArraySchema,
} from "@/schemas/customer";
import { CustomerSummarySchema } from "@/schemas/summary";

import {
  StructuredErrorSchema,
  UnauthorizedErrorSchema,
  UserAndClientIdAuthSchema,
} from "./helpers";

const rootCustomerContract = c.router({
  getById: {
    method: "GET",
    path: "/v3/customers/:customerId",
    query: UserAndClientIdAuthSchema,
    responses: {
      200: CustomerDataSchema,
      401: UnauthorizedErrorSchema,
      404: StructuredErrorSchema,
    },
  },
  getTypes: {
    method: "GET",
    path: "/v3/customers/types",
    query: UserAndClientIdAuthSchema,
    responses: {
      200: CustomerTypeArraySchema,
      401: UnauthorizedErrorSchema,
    },
  },
  getSummaryForId: {
    method: "GET",
    path: "/v3/customers/:customerId/summary",
    query: UserAndClientIdAuthSchema,
    responses: {
      200: CustomerSummarySchema,
      401: UnauthorizedErrorSchema,
      404: StructuredErrorSchema,
    },
  },
});

export { rootCustomerContract };
