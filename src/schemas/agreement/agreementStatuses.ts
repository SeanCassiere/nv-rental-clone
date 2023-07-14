import { z } from "zod";

const AgreementStatusListItemSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const AgreementStatusListSchema = z.array(AgreementStatusListItemSchema);
export type AgreementStatusListParsed = z.infer<
  typeof AgreementStatusListItemSchema
>[];
