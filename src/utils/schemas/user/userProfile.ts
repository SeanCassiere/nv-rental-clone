import { z } from "zod";

export const UserProfileSchema = z
  .object({
    clientId: z.number(),
    userID: z.number(),
    userName: z.string(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    fullName: z.string().nullable(),
    email: z.string().nullable(),
    userRoleID: z.number().nullable(),
    language: z.string().nullable(),
    roleName: z.string().nullable(),
    locationName: z.string().nullable(),
    lastLogin: z.string().nullable(),
    isReservationEmail: z.boolean(),
    isActive: z.boolean(),
    phone: z.string().nullable(),
    scanAccessKey: z.string().nullable(),
    languageName: z.string().nullable(),
    lockOut: z.boolean(),
    locationList: z.any(),
    userIdV3: z.string().nullable(),
    overrideDateFormat: z.string().nullable(),
    overrideTimeFormat: z.string().nullable(),
  })
  .transform((val) => {
    return { ...val, fullName: `${val.firstName} ${val.lastName}` };
  });

export type TUserProfile = z.infer<typeof UserProfileSchema>;
