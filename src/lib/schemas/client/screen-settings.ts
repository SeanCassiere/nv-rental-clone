import { z } from "zod";

const ClientScreenSettingSchema = z.object({
  screenName: z.preprocess((val) => val ?? "", z.string()),
  sectionName: z.preprocess((val) => val ?? "", z.string()),
  fieldName: z.preprocess((val) => val ?? "", z.string()),
  fieldDefaultValue: z.string().nullable(),
  isFieldRequired: z.preprocess((val) => val ?? false, z.boolean()),
  isVisible: z.preprocess((val) => val ?? false, z.boolean()),
});

export type TClientScreenSetting = z.infer<typeof ClientScreenSettingSchema>;
export const ClientScreenSettingListSchema = z.array(ClientScreenSettingSchema);
