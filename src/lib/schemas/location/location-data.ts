import { z } from "zod";

export const LocationByIdSchema = z.object({
  locationId: z.coerce.string(),
  stateName: z.string().nullable(),
  countryName: z.string().nullable(),
  locationName: z.string().nullable(),
  address1: z.string().nullable(),
  address2: z.string().nullable(),
  city: z.string().nullable(),
  countryId: z.coerce.string().default("0"),
  stateID: z.coerce.string().default("0"),
  stateCode: z.string().nullable(),
  postal: z.string().nullable(),
  latitude: z.coerce.number().default(0),
  longitude: z.coerce.number().default(0),
  contactName: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  emailName: z.string().nullable(),
  active: z.boolean().nullable(),
  isReservation: z.boolean().nullable(),
  // bankDetails: z.any().nullable(),
  // logoImage: {
  //   locationLogoImageID: 0,
  //   locationID: 0,
  //   imageName: null,
  //   imageView: null,
  //   locationLogoImageBaseStr: null,
  // },
});

export type TLocationById = z.infer<typeof LocationByIdSchema>;
