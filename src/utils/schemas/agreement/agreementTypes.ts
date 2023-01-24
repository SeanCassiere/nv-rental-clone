import { z } from "zod";

const AgreementTypeSchema = z.object({
  typeId: z.number(),
  typeName: z.string(),
  calculationType: z.string().nullable(),
  // "laguages": null,
  isDefault: z.boolean().default(false).nullable(),
  abbreviation: z.string().nullable(),
  isFront: z.boolean().default(false).nullable(),
  isDeleted: z.boolean().default(false).nullable(),
  isPossibleDelete: z.boolean().default(false).nullable(),
  isAddedByCustomer: z.boolean().default(false).nullable(),
});
export type TAgreementTypeSchema = z.infer<typeof AgreementTypeSchema>;
export const AgreementTypeArraySchema = z.array(AgreementTypeSchema);
