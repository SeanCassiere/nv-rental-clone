import { z } from "zod";

const VehicleTypeSchema = z.object({
  VehicleTypeId: z.number(),
  VehicleTypeName: z.string().default(""),
  FullValue: z.number().nullable(),
  Sample: z.string().default(""),
  Seats: z.string().default("0"),
  Doors: z.string().default("0"),
  Baggages: z.number().default(0).nullable(),
  // Transmission: null,
  Deposit: z.number().default(0).nullable(),
  Path: z.string().default("").nullable(),
  // HtmlContent: null,
  Price: z.coerce.number().nullable(),
  // SIPP: null,
  Images: z.array(z.string()).nullable(),
  Total: z.number().default(0).nullable(),
  TotalBooked: z.number().default(0).nullable(),
  Year: z.number().default(0).nullable(),
  IsReservation: z.boolean().default(false).nullable(),
  MandatoryExcessAmount: z.number().default(0).nullable(),
  PremiumExcessAmount: z.number().default(0).nullable(),
  ExtraPremiumExcessAmount: z.number().default(0).nullable(),
  // ImageList: null,
  DepositPercentage: z.number().default(0).nullable(),
  IsDepositPercentage: z.boolean().default(false).nullable(),
  VehicleGroupId: z.number().nullable(),
  VehicleGroupName: z.number().nullable(),
  TotalBaseRateTax: z.number().default(0).nullable(),
  TotalBasePlusTaxRate: z.number().default(0).nullable(),
});
export type TVehicleTypeParsed = z.infer<typeof VehicleTypeSchema>;
export const VehicleTypeSchemaArray = z.array(VehicleTypeSchema);
