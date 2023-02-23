import { z } from "zod";

export const MisChargeListItemOptionSchema = z.object({
  miscChargeOptionId: z.number(),
  name: z.string().nullable(),
  option: z.number().nullable(),
  value: z.number().nullable(),
  miscChargeName: z.string().nullable(),
  vehicleTypeName: z.string().nullable(),
  locationName: z.string().nullable(),
});
export const MiscChargeListItemSchema = z.object({
  Id: z.number(),
  LocationMiscChargeID: z.number(),
  Name: z.string().nullable(),
  Total: z.number().nullable().default(0),
  Description: z.string().nullable(),
  CalculationType: z.string().nullable(),
  IsQuantity: z.boolean().nullable(),
  IsOptional: z.boolean().nullable(),
  IsTaxable: z.boolean().nullable(),
  MiscChargeType: z.string().nullable(),
  MiscChargeTypeId: z.number().nullable(),
  LocationId: z.number().nullable(),
  LocationName: z.string().nullable(),
  IsCommission: z.boolean().nullable(),
  AddToRevenue: z.boolean().nullable(),
  IsShowInEContract: z.boolean().nullable(),
  IsDeductible: z.boolean().nullable(),
  VehicleType: z.string().nullable(),
  VehicleTypeId: z.number().nullable(),
  LocationTaxIds: z.string().nullable(),
  Options: z.array(MisChargeListItemOptionSchema).nullable(),
  IsBillToInsurance: z.boolean().nullable(),
});

export type MiscChargeListItem = z.infer<typeof MiscChargeListItemSchema>;
export const MiscChargeListSchema = z.array(MiscChargeListItemSchema);
