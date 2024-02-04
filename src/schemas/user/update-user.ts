import { z } from "zod";

export function buildUpdateUserSchema({ REQUIRED }: { REQUIRED: string }) {
  return z.object({
    clientId: z.number().or(z.string()),
    createdBy: z.number().or(z.string()),
    createdDate: z.string(),
    userName: z.string().min(1, REQUIRED),
    firstName: z.string().min(1, REQUIRED),
    lastName: z.string().min(1, REQUIRED),
    phone: z.string(),
    email: z.string().min(1, REQUIRED).email(),
    scanAccessKey: z.string(),
    userRoleID: z.number().or(z.string()),
    language: z.string(),
    locationList: z.array(
      z.object({
        locationId: z.coerce.string(),
        locationName: z.string(),
        isSelected: z.boolean(),
      })
    ),
    isActive: z.boolean(),
    lockOut: z.boolean(),
    isReservationEmail: z.boolean(),
  });
}
export type UpdateUserInput = z.infer<ReturnType<typeof buildUpdateUserSchema>>;

const UserLanguageSchema = z.object({
  key: z.string(),
  value: z.string(),
});
export const UserLanguageListSchema = z.array(UserLanguageSchema);
export type UserLanguageItem = z.infer<typeof UserLanguageSchema>;
