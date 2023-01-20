import { z } from "zod";

const ReservationListItemSchema = z
  .object({
    ReserveId: z.number(),
    AdditionalCharge: z.number(),
    ReservationNumber: z.string().nullable(),
    ReservationType: z.string().nullable(),
    OwningLocationId: z.number(),
    LowestRate: z.string().nullable(),
    ClientId: z.number(),
    CustomerId: z.number(),
    Trim: z.string().nullable(),
    StartDate: z.string().nullable(),
    EndDate: z.string().nullable(),
    CreatedDate: z.string().nullable(),
    Notes: z.string().nullable(),
    FuelType: z.string().nullable(),
    FuelLevel: z.string().nullable(),
    Transmission: z.string().nullable(),
    CurrentOdometer: z.number().nullable(),
    Color: z.string().nullable(),
    Doors: z.coerce.string().nullable(),
    Vin: z.string().nullable(),
    StatusId: z.number().nullable(),
    InsuranceAmt: z.number().nullable(),
    StartLocationId: z.number(),
    StartLocationName: z.string().nullable(),
    StartLocationAddress1: z.string().nullable(),
    StartLocationAddress2: z.string().nullable(),
    StartLocationCity: z.string().nullable(),
    StartLocationPhone: z.string().nullable(),
    StartLocationCountryName: z.string().nullable(),
    StartLocationStateName: z.string().nullable(),
    EndLocationId: z.number().nullable(),
    EndLocationName: z.string().nullable(),
    FirstName: z.string().nullable(),
    LastName: z.string().nullable(),
    Address1: z.string().nullable(),
    Address2: z.string().nullable(),
    City: z.string().nullable(),
    ProductionName: z.string().nullable(),
    CountryName: z.string().nullable(),
    ZipCode: z.string().nullable(),
    DateOfBirth: z.string().nullable(),
    CustomerType: z.string().nullable(),
    Phone: z.string().nullable(),
    hPhone: z.string().nullable(),
    bPhone: z.string().nullable(),
    cPhone: z.string().nullable(),
    Email: z.string().nullable(),
    Company: z.string().nullable(),
    CanceledDate: z.string().nullable(),
    BasePrice: z.number(),
    Note: z.string().nullable(),
    AgreementId: z.number().nullable(),
    AgreementNumber: z.string().nullable(),
    CancellationCharge: z.number().nullable(),
    AdvancedPayment: z.number().nullable(),
    CreditCardExpiryDate: z.string().nullable(),
    CreditCardNo: z.string().nullable(),
    CreditCardType: z.string().nullable(),
    CreditCardCVSNo: z.string().nullable(),
    CreditCardBillingZipCode: z.string().nullable(),
    LDW: z.number().nullable(),
    TLDW: z.number().nullable(),
    SpecialNote: z.string().nullable(),
    PromotionId: z.number().nullable(),
    Deposit: z.number().nullable(),
    LogId: z.number().nullable(),
    ImageName: z.string().nullable(),
    TotalDays: z.number().nullable(),
    FullDepositAmount: z.number().nullable(),
    InstallmentAmount: z.number().nullable(),
    PerInstallmentAmount: z.number().nullable(),
    InstallmentQty: z.number().nullable(),
    PreAdjustment: z.number().default(0).nullable(),
    ReservationPrimaryId: z.number().nullable(),
    Prep: z.boolean().default(false),
    Wrap: z.boolean().default(false),
    //
    VehicleTypeId: z.number(),
    VehicleType: z.string(),
    VehicleId: z.number(),
    VehicleMakeName: z.string().nullable(),
    ModelId: z.number().nullable(),
    ModelName: z.string().nullable(),
    LicenseNo: z.string().nullable(),
    VehicleNo: z.string().nullable(),
    Year: z.number().nullable(),
    PONo: z.string().nullable(),
    RONo: z.string().nullable(),
    //
    VehicleTypeId2: z.number().nullable(),
    VehicleType2: z.string().nullable(),
    VehicleId2: z.number().nullable(),
    VehicleMakeName2: z.string().nullable(),
    ModelName2: z.string().nullable(),
    LicenseNo2: z.string().nullable(),
    VehicleNo2: z.string().nullable(),
    Year2: z.number().nullable(),
    PONo2: z.string().nullable(),
    RONo2: z.string().nullable(),
    //
    TotalDiscount: z.number().default(0).nullable(),
    LocationId: z.number().nullable(),
    DaysInWeek: z.number().default(0).nullable(),
    CreatedBy: z.string().nullable(),
    LastUpdateByName: z.string().nullable(),
    ReservationStatus: z.number().nullable(),
    ReservationStatusName: z.string().nullable(),
    IsCompound: z.boolean().default(false),
    IsRetrieval: z.boolean().default(false).nullable(),
    IsDelivery: z.boolean().default(false).nullable(),
    ProjectedMileage: z.number().default(0).nullable(),
    ReferralId: z.number().nullable(),
    RefferalName: z.string().nullable(),
    VoucherNo: z.string().or(z.number()).nullable(),
    LocationEmail: z.string().nullable(),
    LocationEmailName: z.string().nullable(),
    Total: z.number().default(0).nullable(),
    CheckoutState: z.string().nullable(),
    Checkinstate: z.string().nullable(),
    Destination: z.string().nullable(),
  })
  .transform((item) => {
    return {
      ...item,
      id: item.ReserveId,
      FullName: `${item.FirstName} ${item.LastName}`,
    };
  });

export type TReservationListItemParsed = z.infer<
  typeof ReservationListItemSchema
>;
export const ReservationListItemListSchema = z.array(ReservationListItemSchema);
