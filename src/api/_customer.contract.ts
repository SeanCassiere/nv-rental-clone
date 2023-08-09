import { z } from "zod";

import { c } from "@/api/c";
import {
  // PaginationSchema,
  StructuredErrorSchema,
  UserAndClientIdAuthSchema,
} from "./helpers";
import {
  CustomerDataSchema,
  CustomerTypeArraySchema,
} from "@/schemas/customer";

const rootCustomerContract = c.router({
  getCustomerById: {
    method: "GET",
    path: "/v3/customers/:customerId",
    query: UserAndClientIdAuthSchema,
    responses: {
      200: CustomerDataSchema,
      404: StructuredErrorSchema,
    },
  },
  getCustomerTypes: {
    method: "GET",
    path: "/v3/customers/types",
    query: UserAndClientIdAuthSchema,
    responses: {
      200: CustomerTypeArraySchema,
    },
  },
});

export { rootCustomerContract };
