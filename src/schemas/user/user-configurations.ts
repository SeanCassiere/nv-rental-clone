import { z } from "zod";

const UserConfigurationSchema = z
  .object({
    email: z.string().nullable(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    fullName: z.string().nullable(),
    isActive: z.boolean(),
    isReservationEmail: z.boolean(),
    language: z.string().nullable(),
    languageName: z.string().nullable(),
    locationName: z.string().nullable(),
    lastLogin: z.string().nullable(),
    lockOut: z.boolean(),
    phone: z.string().nullable(),
    roleName: z.string().nullable(),
    userID: z.number(),
    userIdV3: z.string().nullable(),
    userName: z.string(),
    userRoleID: z.number().nullable(),
  })
  .transform((user) => {
    return {
      ...user,
      fullName: user?.fullName ?? `${user?.firstName} ${user?.lastName}`,
    };
  });
export const UserConfigurationsListSchema = z.array(UserConfigurationSchema);
export type TUserConfigurations = z.infer<typeof UserConfigurationsListSchema>;
