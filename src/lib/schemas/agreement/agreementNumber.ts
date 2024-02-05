import { z } from "zod";

export const GenerateAgreementNumberSchema = z.object({
  agreementNo: z.string(),
});
export type GenerateAgreementNoDataParsed = z.infer<
  typeof GenerateAgreementNumberSchema
>;
