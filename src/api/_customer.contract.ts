import { z } from "zod";

import { c } from "@/api/c";

import {
  CustomerDataSchema,
  CustomerTypeArraySchema,
} from "@/schemas/customer";

import {
  // PaginationSchema,
  StructuredErrorSchema,
  UserAndClientIdAuthSchema,
} from "./helpers";

const rootCustomerContract = c.router({
  getById: {
    method: "GET",
    path: "/v3/customers/:customerId",
    query: UserAndClientIdAuthSchema,
    responses: {
      200: CustomerDataSchema,
      404: StructuredErrorSchema,
    },
  },
  getTypes: {
    method: "GET",
    path: "/v3/customers/types",
    query: UserAndClientIdAuthSchema,
    responses: {
      200: CustomerTypeArraySchema,
    },
  },
});

export { rootCustomerContract };
