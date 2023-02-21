import { z } from "zod";

export const RentalRateListItemSchema = z
  .object({
    clientId: z.number().nullable(),
    locationId: z.number().nullable(),
    rateId: z.number().nullable(),
    vehicleTypeId: z.number().nullable(),
    calculatedBy: z.coerce.string().nullable(),
    kMorMileageCharge: z.number().nullable(),
    fuelCharge: z.number().nullable(),
    oneWayCharge: z.number().nullable(),
    graceMinutes: z.number().nullable(),
    hourlyRate: z.number().nullable(),
    hourlyQty: z.number().nullable(),
    halfDayRate: z.number().nullable(),
    halfDayQty: z.number().nullable(),
    dailyRate: z.number().nullable(),
    dailyQty: z.number().nullable(),
    weekendDayRate: z.number().nullable(),
    weekendDailyQty: z.number().nullable(),
    weeklyRate: z.number().nullable(),
    weeklyQty: z.number().nullable(),
    monthlyRate: z.number().nullable(),
    monthlyQty: z.number().nullable(),
    packageName: z.string().nullable(),
    packageRate: z.number().nullable(),
    packageRateId: z.number().nullable(),
    totalDays: z.number().nullable(),
    daysInWeek: z.number().nullable(),
    extraHourlyRate: z.number().nullable(),
    extraHourlyQty: z.number().nullable(),
    extraDailyRate: z.number().nullable(),
    extraDailyQty: z.number().nullable(),
    extraWeekEndDayRate: z.number().nullable(),
    extraWeekEndDayQty: z.number().nullable(),
    extraWeeklyRate: z.number().nullable(),
    extraWeeklyQty: z.number().nullable(),
    dailyKMorMileageAllowed: z.number().nullable(),
    weeklyKMorMileageAllowed: z.number().nullable(),
    monthlyKMorMileageAllowed: z.number().nullable(),
    totalKMorMileageAllowed: z.number().nullable(),
    packageKMorMileageAllowed: z.number().nullable(),
    packageDaysIncluded: z.number().nullable(),
    lastUpdatedBy: z.coerce.string().nullable(),
    lastUpdated: z.coerce.string().nullable(),
    rateName: z.string().nullable(),
    active: z.any(),
    specialRate: z.number().nullable(),
    specialKMorMileageAllowed: z.number().nullable(),
    extraSpecialRate: z.number().nullable(),
    startDate: z.string().nullable(),
    endDate: z.string().nullable(),
    startDateStr: z.string().nullable(),
    endDateStr: z.string().nullable(),
    rateValue: z.number().nullable(),
    extraValue: z.number().nullable(),
    howMany: z.number().nullable(),
    howManyExtra: z.number().nullable(),
    kmAllowed: z.number().nullable(),
    isVisible: z.boolean(),
    isLowest: z.boolean(),
    rateTotal: z.number().nullable(),
    extraRateTotal: z.number().nullable(),
    userId: z.number().nullable(),
    initalRate: z.number().nullable(),
    incrementValue: z.number().nullable(),
    dayRateList: z.array(z.any()).nullable(),
    estimatedTotal: z.number().nullable(),
    taxSum: z.number().nullable(),
    reservationSummary: z.any(),
    initialCharge: z.number().nullable(),
    initialChargeHours: z.number().nullable(),
    halfHourlyRate: z.number().nullable(),
    halfHourlyQty: z.number().nullable(),
    actualHourlyRate: z.number().nullable(),
    actualHalfDayRate: z.number().nullable(),
    actualDailyRate: z.number().nullable(),
    actualWeeklyRate: z.number().nullable(),
    actualMonthlyRate: z.number().nullable(),
    actualExtraHourlyRate: z.number().nullable(),
    actualExtraDailyRate: z.number().nullable(),
    actualExtraWeekllyRate: z.number().nullable(),
    vehicleType: z.string().nullable(),
    isVehicleAvailable: z.boolean(),
    vehicleStatusId: z.number().nullable(),
    vehicleId: z.number().nullable(),
    //
    displaydailyMilesAllowed: z.number().nullable(),
    displayweeklyMilesAllowed: z.number().nullable(),
    displaymonthlyMilesAllowed: z.number().nullable(),
    //
    isExtraMileageChargeTaxable: z.boolean(),
    isExtraDayChargeTaxable: z.boolean(),
    isFuelChargeTaxable: z.boolean(),
    //
    isDayRate: z.boolean(),
    isDayWeek: z.boolean(),
    //
    monCount: z.number().nullable().default(0),
    monRate: z.number().nullable().default(0),
    tuesCount: z.number().nullable().default(0),
    tuesRate: z.number().nullable().default(0),
    wedCount: z.number().nullable().default(0),
    wedRate: z.number().nullable().default(0),
    thursCount: z.number().nullable().default(0),
    thursRate: z.number().nullable().default(0),
    friCount: z.number().nullable().default(0),
    friRate: z.number().nullable().default(0),
    satCount: z.number().nullable().default(0),
    satRate: z.number().nullable().default(0),
    sunCount: z.number().nullable().default(0),
    sunRate: z.number().nullable().default(0),
    type: z.any(),
  })
  .passthrough();
export type RentalRateListItemParsed = z.infer<typeof RentalRateListItemSchema>;
