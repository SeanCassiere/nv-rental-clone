import { z } from "zod";

const LocationSchema = z.object({
  locationId: z.number(),
  stateName: z.string().nullable(),
  countryName: z.string().nullable(),
  locationName: z.string().nullable(),
  address1: z.string().nullable(),
  address2: z.string().nullable(),
  city: z.string().nullable(),
  stateID: z.number().nullable(),
  countryId: z.number().nullable(),
  postal: z.string().nullable(),
  latitude: z.string().nullable(),
  longitude: z.string().nullable(),
  contactName: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  emailName: z.string().nullable(),
  active: z.boolean().default(false).nullable(),
  isReservation: z.boolean().default(false).nullable(),
  // "bankDetails": null,
  // "logoImage": null,
  // "stateCode": null
});
export type TLocationParsed = z.infer<typeof LocationSchema>;
export const LocationSchemaArray = z.array(LocationSchema);
