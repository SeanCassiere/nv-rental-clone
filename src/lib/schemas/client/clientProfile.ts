import { z } from "zod";

export const ClientProfileSchema = z.object({
  clientName: z.string().nullable(),
  clientAddress: z.string().nullable(),
  clientCity: z.string().nullable(),
  clientState: z.string().nullable(),
  clientCountry: z.string().nullable(),
  clientZipCode: z.string().nullable(),
  clienPhoneNo: z.string().nullable(),
  clientEmail: z.string().nullable(),
  address: z.string().nullable(),
  clientContactName: z.string().nullable(),
  currency: z.string().nullable(),
  maxVehiclesReached: z.boolean(),
  isActive: z.boolean(),
});
export type TClientProfileSchema = z.infer<typeof ClientProfileSchema>;
