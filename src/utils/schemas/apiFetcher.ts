import { z } from "zod";

const ApiResponseMetaSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
  totalRecords: z.number(),
  status: z.number(),
  ok: z.boolean(),
});

export function validateApiResWithZodSchema<TItemSchema extends z.ZodSchema>(
  schema: TItemSchema,
  response: any
) {
  const ApiResponseWithDataSchema = ApiResponseMetaSchema.extend({
    data: schema,
  });
  return ApiResponseWithDataSchema.parse(response);
}
