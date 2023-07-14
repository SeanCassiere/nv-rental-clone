import type { RentalRateParsed } from "../schemas/rate";

export type CalculateRentalSummaryAmountsInput = {
  startDate: Date;
  endDate: Date;
  checkoutLocationId: number;
  checkinLocationId: number;
  miscCharges: CalculateRentalSummaryMiscChargeType[];
  rate: RentalRateParsed;
  vehicleTypeId: number;
  taxIds: number[];
  advancePayment: number;
  amountPaid: number;
  preAdjustment: number;
  postAdjustment: number;
  securityDeposit: number;
  additionalCharge: number;
  unTaxableAdditional: number;
  fuelLevelOut: string;
  takeSize: number;
  fuelLevelIn: string;
  odometerOut: number;
  odometerIn: number;
  agreementId: number;
  agreementTypeName?: string;
  isCheckin: boolean;
  promotionIds: any[];
  agreementInsurance: null;
  writeOffAmount: number | null;
  customerId: number;
};
export type CalculateRentalSummaryMiscChargeType = {
  id: number; // misc-charge id
  locationMiscChargeId: number;
  quantity: number;
  startDate: string;
  endDate: string;
  optionId: number;
  isSelected: boolean;
  value: number;
  unit: number;
  isTaxable: boolean;
};
