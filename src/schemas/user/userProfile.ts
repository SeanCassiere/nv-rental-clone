import { z } from "zod";

function momentToDateFnsFormat(format: string) {
  return format
    .replace("DD", "dd") // 01 02 ... 30 31
    .replace("Do", "do") // 1st 2nd ... 30th 31st
    .replace("D", "d") // 1 2 ... 30 31
    .replace("YYYY", "yyyy") // 0001 0002 ... 9998 9999
    .replace("YY", "yy") // 00 01 ... 98 99
    .replace("a", "aaa") // am pm
    .replace("A", "a"); // AM PM
}

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
    locationList: z.array(
      z.object({
        isSelected: z.preprocess((val) => (val ? true : false), z.boolean()),
        locationName: z.preprocess((val) => val ?? "", z.string()),
        locationId: z.number(),
      })
    ),
    userIdV3: z.string().nullable(),
    overrideDateFormat: z.string().nullable(),
    overrideTimeFormat: z.string().nullable(),
  })
  .transform((user) => {
    let overrideDateFormat: string | null = null;
    let overrideTimeFormat: string | null = null;

    if (user?.overrideDateFormat) {
      // convert momentjs string to date-fns string
      overrideDateFormat = momentToDateFnsFormat(user.overrideDateFormat);
    }
    if (user?.overrideTimeFormat) {
      // convert momentjs string to date-fns string
      overrideTimeFormat = momentToDateFnsFormat(user.overrideTimeFormat);
    }

    return {
      ...user,
      fullName: `${user?.firstName} ${user?.lastName}`,
      overrideDateFormat: overrideDateFormat,
      overrideTimeFormat: overrideTimeFormat,
    };
  });

export type TUserProfile = z.infer<typeof UserProfileSchema>;
