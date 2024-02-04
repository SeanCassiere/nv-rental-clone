import { z } from "zod";

export function buildUpdateLocationSchema({
  REQUIRED,
  NOT_VALID_EMAIL,
}: {
  REQUIRED: string;
  NOT_VALID_EMAIL: string;
}) {
  return z.object({
    clientId: z.string(),
    lastUpdatedBy: z.string(),
    locationName: z.string().min(1, REQUIRED),
    address1: z.string().min(1, REQUIRED),
    address2: z.string(),
    city: z.string().min(1, REQUIRED),
    postal: z.string().min(1, REQUIRED),
    stateId: z
      .string()
      .min(1, REQUIRED)
      .refine((val) => val !== "" && val !== "0", {
        message: REQUIRED,
      }),
    countryId: z
      .string()
      .min(1, REQUIRED)
      .refine((val) => val !== "" && val !== "0", {
        message: REQUIRED,
      }),
    active: z.boolean(),
    isReservation: z.boolean(),
    contactName: z.string(),
    phone: z.string(),
    email: z.string().email(NOT_VALID_EMAIL).min(1, REQUIRED),
    emailName: z.string().min(1, REQUIRED),
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
    parentLocationId: z.string().default("0"),
    bankDetails: z.object({
      accountName: z.string().min(0).max(255),
      accountNumber: z.string().min(0).max(255),
      bankName: z.string().min(0).max(255),
      bankAddress: z.string().min(0).max(255),
      swiftCode: z.string().min(0).max(255),
    }),
  });
}
export type UpdateLocationInput = z.infer<
  ReturnType<typeof buildUpdateLocationSchema>
>;
