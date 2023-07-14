import { z } from "zod";

const VehicleExchangeListItemSchema = z.object({
  vehicleExchangeId: z.number(),
  createdByName: z.string().nullable(),
  lastUpdatedByName: z.string().nullable(),
  exchangeDate: z.string().nullable(),
  note: z.string().nullable(),
  //
  orgVehicleViewName: z.string().nullable(),
  orgVehicleStatus: z.string().nullable(),
  orgVehicleOdometerIn: z.number().nullable(),
  orgVehicleFuelLevelIn: z.string().nullable(),
  orgVehicleNo: z.string().nullable(),
  orgVehicleMake: z.string().nullable(),
  orgVehicleModel: z.string().nullable(),
  orgVehicleYear: z.string().nullable(),
  orgVehicleLicenseNo: z.string().nullable(),
  orgVehicleId: z.number(),
  orgVehicleType: z.string().nullable(),
  //
  newVehicleViewName: z.string().nullable(),
  newVehicleOdometerOut: z.number().nullable(),
  newVehicleFuelLevelOut: z.string().nullable(),
  newVehicleNo: z.string().nullable(),
  newVehicleMake: z.string().nullable(),
  newVehicleModel: z.string().nullable(),
  newVehicleYear: z.string().nullable(),
  newVehicleLicenseNo: z.string().nullable(),
});

export type TVehicleExchangeListItemParsed = z.infer<
  typeof VehicleExchangeListItemSchema
>;
export const VehicleExchangeItemListSchema = z.array(
  VehicleExchangeListItemSchema,
);
