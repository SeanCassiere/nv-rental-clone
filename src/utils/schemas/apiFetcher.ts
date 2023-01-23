import { z } from "zod";

const ApiResponseMetaSchema = z.object({
  page: z.number().default(1),
  pageSize: z.number().default(10),
  totalPages: z.number().default(1),
  totalRecords: z.number().default(1),
  status: z.number().default(200),
  ok: z.boolean().default(true),
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
