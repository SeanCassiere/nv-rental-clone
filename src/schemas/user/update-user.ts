import { z } from "zod";

import i18n from "@/i18next-config";

const REQUIRED = i18n.t("display.required", { ns: "labels" });

export const UpdateUserSchema = z.object({
  clientId: z.number(),
  createdBy: z.number(),
  createdDate: z.string(),
  userName: z.string().min(1, REQUIRED),
  firstName: z.string().min(1, REQUIRED),
  lastName: z.string().min(1, REQUIRED),
  phone: z.string(),
  email: z.string().min(1, REQUIRED).email(),
  scanAccessKey: z.string(),
  userRoleID: z.number(),
  language: z.string(),
  locationList: z.array(
    z.object({
      locationId: z.number(),
      locationName: z.string(),
      isSelected: z.boolean(),
    })
  ),
  isActive: z.boolean(),
  lockOut: z.boolean(),
  isReservationEmail: z.boolean(),
});
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

const UserLanguageSchema = z.object({
  key: z.string(),
  value: z.string(),
});
export const UserLanguageListSchema = z.array(UserLanguageSchema);
export type UserLanguageItem = z.infer<typeof UserLanguageSchema>;
