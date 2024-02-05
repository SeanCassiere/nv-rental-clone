import { z } from "zod";

import { c } from "@/lib/api/c";
import {
  CustomerDataSchema,
  CustomerListItemListSchema,
  CustomerTypeArraySchema,
} from "@/lib/schemas/customer";
import { CustomerSummarySchema } from "@/lib/schemas/summary";

import {
  PaginationSchema,
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
  getList: {
    method: "GET",
    path: "/v3/customers",
    query: UserAndClientIdAuthSchema.merge(PaginationSchema).extend({
      Active: z.string().optional(),
      SortDirection: z.string().optional(),
      CustomerTypes: z.array(z.string()).optional(),
      Keyword: z.string().optional(),
      DateOfbirth: z.string().optional(),
      Phone: z.string().optional(),
    }),
    responses: {
      200: CustomerListItemListSchema,
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
