import { z } from "zod";

const ClientFeatureSchema = z.object({
  featureName: z.string(),
  clientFeatureId: z.number().nullable(),
  clientId: z.number().nullable(),
  featureId: z.number().nullable(),
  value: z.string().nullable(),
});
export const ClientFeatureListSchema = z.array(ClientFeatureSchema);
export type TClientFeatureSchema = z.infer<typeof ClientFeatureSchema>;
