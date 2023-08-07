import { z } from "zod";

const StructuredErrorSchema = z.object({
  type: z.string().nullable(),
  title: z.string().nullable(),
  status: z.number(),
  traceId: z.string().nullable(),
});

const ClientIdAuthSchema = z.object({
  clientId: z.string(),
});

const UserAndClientIdAuthSchema = ClientIdAuthSchema.extend({
  userId: z.string(),
});

const PaginationSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
});

const StringArraySchema = z.array(z.string());

export {
  StructuredErrorSchema,
  ClientIdAuthSchema,
  UserAndClientIdAuthSchema,
  PaginationSchema,
  StringArraySchema,
};
