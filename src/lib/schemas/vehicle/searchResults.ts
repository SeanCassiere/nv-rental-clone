import { z } from "zod";

const VehicleListItemSchema = z
  .object({
    VehicleId: z.number(),
    VehicleNo: z.string().nullable(),
    ModelId: z.number(),
    MakeId: z.number(),
    VehicleMakeName: z.string().nullable(),
    ModelName: z.string().nullable(),
    Year: z.number(),
    Active: z.boolean(),
    LicenseNo: z.string().nullable(),
    LicenseState: z.string().nullable(),
    OwningLocationId: z.number(),
    OwningLocationName: z.string().nullable(),
    Color: z.string().nullable(),
    CurrentLocationId: z.number(),
    CurrentLocationName: z.string().nullable(),
    StatusId: z.number(),
    VehicleTypeId: z.number(),
    VehicleType: z.string().nullable(),
    CurrentOdometer: z.number(),
    Transmission: z.string().nullable(),
    Cylinders: z.number().nullable(),
    Memo: z.string().nullable(),
    FuelLevel: z.string().nullable(),
    TankSize: z.number(),
    CreatedBy: z.string().nullable(),
    CreatedByName: z.string().nullable(),
    LeasingCompanyName: z.string().nullable(),
    InsuranceCompanyName: z.string().nullable(),
    FuelType: z.string().nullable(),
    LeaseAmt: z.number().catch(0),
    DownPayment: z.number().catch(0),
    CashValue: z.number().catch(0),
    Vin: z.string().nullable(),
    Replaced: z.boolean().nullable(),
    VehicleStatus: z.string().nullable(),
    VehicleImage: z.string().nullable(),
    CurrentRenter: z.string().nullable(),
    FutureRentalDate: z.string().nullable(),
    LicenseStateName: z.string().nullable(),
    IsUpgrade: z.boolean().nullable(),
    Price: z.number().nullable(),
    FullValue: z.number().nullable(),
    Doors: z.coerce.string().nullable(),
    Seats: z.number().nullable(),
    Baggages: z.number(),
  })
  .transform((val) => {
    return { ...val, id: val.VehicleId };
  });

export type TVehicleListItemParsed = z.infer<typeof VehicleListItemSchema>;
export const VehicleListItemListSchema = z.array(VehicleListItemSchema);
