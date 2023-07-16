import { z } from "zod";

import { RentalRateListItemSchema } from "../rate";

export const AgreementMiscChargeItem = z.object({
  miscChargeId: z.number().nullable(),
  miscChargeCode: z.number().nullable(),
  unit: z.number().nullable(),
  name: z.string().nullable(),
  description: z.string().nullable(),
  calculationType: z.string().nullable(),
  taxNotAvailable: z.boolean(),
  isCommission: z.boolean(),
  value: z.number().nullable(),
  totalValue: z.number().nullable(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  quantity: z.number().nullable(),
  createdDate: z.string().nullable(),
  gLcode: z.string().nullable(),
  locationMiscChargeId: z.number().nullable(),
  isChargeByPeriod: z.boolean().nullable(),
  isTaxable: z.boolean().nullable(),
  locationTaxIds: z.string().nullable(),
  isSelected: z.boolean(),
  isQuantity: z.boolean(),
  locationMiscChargeID: z.number().nullable(),
  vehicleTypeId: z.number().nullable(),
  misChargeCode: z.number().nullable(),
  isOptional: z.boolean().nullable(),
  printValue: z.coerce.string().nullable(),
  oldStartDateString: z.string().nullable(),
  oldEndDateString: z.string().nullable(),
  startDateString: z.string().nullable(),
  createddateString: z.string().nullable(),
  endDateString: z.string().nullable(),
  isDeleted: z.boolean(),
  isFreeze: z.boolean(),
  isAlreadySelected: z.boolean(),
  isDeductible: z.boolean(),
  locationId: z.number().nullable(),
  locationName: z.string().nullable(),
  vehicleType: z.coerce.string().nullable(),
  miscTaxList: z.any().nullable(),
  totaltax: z.number().nullable(),
  subTotal: z.number().nullable(),
  amountPaid: z.number().nullable(),
  amountRemaining: z.number().nullable(),
  miscchargeTypeId: z.number().nullable(),
  option: z.coerce.string().nullable(),
  misChargeOptionList: z.array(z.any()).nullable(),
  optionId: z.number().nullable(),
  isBillToInsurance: z.boolean().nullable(),
});

export const AgreementDataSchema = z.object({
  agreementId: z.number(),
  agreementNumber: z.string().nullable(),
  agreementType: z.string().nullable(),
  checkinDate: z.string(),
  checkoutDate: z.string(),
  customerId: z.number(),
  clientId: z.number(),
  rentalReason: z.string().nullable(),
  lowestRate: z.boolean().nullable(),
  odometerOut: z.number().nullable(),
  odometerIn: z.number().nullable(),
  fuelLevelOut: z.string().nullable(),
  fuelLevelIn: z.string().nullable(),
  totalAmount: z.number(),
  advancePaid: z.number(),
  paymentMethod: z.string().nullable(),
  extraHourlyRate: z.number(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  phone: z.string().nullable(),
  hPhone: z.string().nullable(),
  bPhone: z.string().nullable(),
  cPhone: z.string().nullable(),
  billingAddress1: z.string().nullable(),
  rateLocationName: z.string().nullable(),
  rateLocation: z.string().nullable(),
  companyName: z.string().nullable(),
  address1: z.string().nullable(),
  address2: z.string().nullable(),
  city: z.string().nullable(),
  stateId: z.number(),
  stateName: z.string().nullable(),
  countryId: z.number(),
  countryName: z.string().nullable(),
  zipCode: z.string().nullable(),
  email: z.string().nullable(),
  creditCardType: z.string().nullable(),
  creditCardNo: z.string().nullable(),
  creditCardCVSNo: z.string().nullable(),
  creditCardExpiryDate: z.string().nullable(),
  licenseExpiryDate: z.string().nullable(),
  customerLicenseNumber: z.string().nullable(),
  licenseIssueState: z.string().nullable(),
  insuranceExpiryDate: z.string().nullable(),
  checkoutLocation: z.number(),
  checkoutLocationName: z.string().nullable(),
  checkoutLocationAddress1: z.string().nullable(),
  checkoutLocationAddress2: z.string().nullable(),
  checkoutLocationCity: z.string().nullable(),
  checkoutLocationEmail: z.string().nullable(),
  checkoutLocationEmailName: z.string().nullable(),
  checkoutLocationState: z.string().nullable(),
  checkoutLocationCountry: z.string().nullable(),
  checkoutLocationPhone: z.string().nullable(),
  checkinLocation: z.number(),
  checkinLocationName: z.string().nullable(),
  vehicleId: z.number(),
  vehicleId2: z.number().nullable(),
  vehicleTypeId: z.number(),
  vehicleNo: z.string().nullable(),
  vehicleType: z.string().nullable(),
  makeId: z.number(),
  vehicleMakeName: z.string().nullable(),
  modelId: z.number(),
  modelName: z.string().nullable(),
  trim: z.string().nullable(),
  year: z.coerce.string(),
  origionalOdometer: z.number().nullable(),
  currentOdometer: z.number().nullable(),
  fuelLevel: z.string().nullable(),
  licenseNo: z.string().nullable(),
  takeSize: z.number().nullable(),
  statusId: z.number(),
  createdDate: z.string().nullable(),
  status: z.number(),
  rateId: z.number(),
  rateName: z.string().nullable(),
  hourlyRate: z.number().nullable(),
  dailyRate: z.number().nullable(),
  extraDaily: z.number().nullable(),
  weeklyRate: z.number().nullable(),
  extraWeekllyRate: z.number().nullable(),
  fuelCharge: z.number().nullable(),
  kMorMileageCharge: z.number().nullable(),
  monthlyRate: z.number().nullable(),
  kmDaily: z.number().nullable(),
  kmWeekly: z.number().nullable(),
  kmMonthly: z.number().nullable(),
  deliveryDate: z.string().nullable(),
  returnDate: z.string().nullable(),
  returnLocation: z.number().nullable(),
  returnLocationName: z.string().nullable(),
  kmCharge: z.number().nullable(),
  additionalCharge: z.number().nullable(),
  extraDayCharge: z.number().nullable(),
  extraKMCharge: z.number().nullable(),
  extraFuelCharge: z.number().nullable(),
  referralId: z.number().nullable(),
  voucherNo: z.string().nullable(),
  maxLDW: z.number(),
  maxTLDW: z.number(),
  hourlyQty: z.number().nullable(),
  dailyQty: z.number().nullable(),
  weeklyQty: z.number().nullable(),
  monthlyQty: z.number().nullable(),
  extraHourlyQty: z.number().nullable(),
  extraMonthlyQty: z.number().nullable(),
  extraWeeklyQty: z.number().nullable(),
  extraDailyQty: z.number().nullable(),
  amountPaid: z.number().nullable(),
  balanceDue: z.number(),
  returnPaymentMethod: z.string().nullable(),
  destination: z.string().nullable(),
  extraCheckOutLocation: z.string().nullable(),
  extraCheckInLocation: z.string().nullable(),
  returnVehicleStatus: z.string().nullable(),
  discount: z.number().nullable(),
  subTotal: z.number(),
  baseCharge: z.number(),
  unTaxableAdditional: z.number(),
  extraDays: z.number().nullable(),
  specialRate: z.number().nullable(),
  kmSpecial: z.number().nullable(),
  specialQty: z.number().nullable(),
  extraSpecialQty: z.number().nullable(),
  extraSpecialRate: z.number().nullable(),
  additionalCharges: z.number().nullable(),
  poNo: z.string().nullable(),
  roNo: z.string().nullable(),
  maintenanceEvery: z.number().nullable(),
  creditCardBillingZipCode: z.string().nullable(),
  createdByName: z.string().nullable(),
  deposit: z.number().nullable(),
  promoCodeId: z.number().nullable(),
  promotionDiscount: z.number().nullable(),
  fullDepositAmount: z.number().nullable(),
  installmentAmount: z.number().nullable(),
  perInstallmentAmount: z.number().nullable(),
  installmentQty: z.number().nullable(),
  isCompound: z.boolean(),
  totalDays: z.number(),
  agreementPrimaryId: z.number(),
  prep: z.coerce.string().nullable(),
  wrap: z.coerce.string().nullable(),
  vehicleTypeId2: z.number().nullable(),
  poNo2: z.string().nullable(),
  roNo2: z.string().nullable(),
  licenseNo2: z.string().nullable(),
  vehicleNo2: z.string().nullable(),
  year2: z.string().nullable(),
  vehicleType2: z.string().nullable(),
  vehicleMakeName2: z.string().nullable(),
  modelName2: z.string().nullable(),
  isRiskAgreement: z.boolean().nullable(),
  riskNote: z.string().nullable(),
  riskDate: z.string().nullable(),
  specialNote: z.string().nullable(),
  note: z.string().nullable(),
  contractReason: z.number().nullable(),
  changedDate: z.string().nullable(),
  contractExtendedPerioid: z.number().nullable(),
  contractExtendReasonDesc: z.string().nullable(),
  daysInWeek: z.number(),
  lastUpdatedBy: z.string().nullable(),
  checkedInByName: z.string().nullable(),
  agreementStatusId: z.number().nullable(),
  isDelivery: z.boolean(),
  isRetrieval: z.boolean(),
  projectMileage: z.number().nullable(),
  retrivalCode: z.string().nullable(),
  signatureName: z.string().nullable(),
  referralName: z.string().nullable(),
  contactName: z.string().nullable(),
  address: z.string().nullable(),
  contactPhone: z.string().nullable(),
  referralCommission: z.number().nullable(),
  initialRateTotal: z.number().nullable(),
  finalRateTotal: z.number().nullable(),
  totMisChargTaxable: z.number().nullable(),
  totMisChargNonTaxable: z.number().nullable(),
  totalTax: z.number().nullable(),
  sourceId: z.number().nullable(),
  isDeliveryOld: z.boolean(),
  isRetrievalOld: z.boolean(),
  reimbursementAmount: z.number().nullable(),

  depositTotals: z
    .object({
      depositAmount: z.number(),
      onHoldAmount: z.number(),
      refundAmount: z.number(),
      releaseAmount: z.number(),
      forfeitureAmount: z.number(),
      totalCanceledAmount: z.number(),
      balanceDeposit: z.number(),
    })
    .nullable(),

  rateList: z.array(RentalRateListItemSchema),

  taxList: z.array(
    z.object({
      agreementID: z.number().nullable(),
      taxId: z.number().nullable(),
      name: z.string().nullable(),
      description: z.string().nullable(),
      value: z.number(),
      isOption: z.boolean(),
      isSelected: z.boolean(),
      locationId: z.number().nullable(),
      taxValue: z.number().nullable(),
      locationName: z.string().nullable(),
      locationTaxID: z.number().nullable(),
      createdBy: z.number().nullable(),
      createdByName: z.string().nullable(),
      lastUpdatedByName: z.string().nullable(),
      activeDate: z.string().nullable(),
      expiryDate: z.string().nullable(),
      activeDatestr: z.string().nullable(),
      expiryDatestr: z.string().nullable(),
      taxSelectedStatus: z.any(),
      glCode: z.string().nullable(),
    }),
  ),

  driverList: z.array(
    z.object({
      driverId: z.number(),
      agreementId: z.number().nullable(),
      customerId: z.number().nullable(),
      driverName: z.string().nullable(),
      firstName: z.string().nullable(),
      lastName: z.string().nullable(),
      dateOfBirth: z.string().nullable(),
      driverType: z.number(),
      createdBy: z.coerce.string().nullable(),
      licenseNumber: z.string().nullable(),
      licenseCategory: z.string().nullable(),
      licenseExpiryDate: z.string().nullable(),
      email: z.string().nullable(),
      licenseIssueDate: z.string().nullable(),
      licenseIssueState: z.string().nullable(),
      hPhone: z.string().nullable(),
      bPhone: z.string().nullable(),
      cPhone: z.string().nullable(),
      address: z.string().nullable(),
      city: z.string().nullable(),
      stateId: z.number().nullable(),
      zipCode: z.string().nullable(),
      countryId: z.number().nullable(),
      signatureName: z.string().nullable(),
      signatureImageUrl: z.string().nullable(),
      reservationId: z.number().nullable(),
      insuranceCompany: z.string().nullable(),
      checkForDelete: z.number().nullable(),
      dateofBirth: z.string().nullable(),
      dateofBirthStr: z.string().nullable(),
      createdDate: z.string().nullable(),
      updatedDate: z.string().nullable(),
      updateBy: z.coerce.string().nullable(),
      driverLicenseNumber: z.string().nullable(),
      driverLicenseCategory: z.string().nullable(),
      driverLicenseExpiryDate: z.string().nullable(),
      isDelete: z.boolean(),
      isFromCustomer: z.boolean(),
      phone: z.string().nullable(),
      signatureImageUrlString: z.string().nullable(),
      startDate: z.string().nullable(),
      endDate: z.string().nullable(),
      referenceType: z.string().nullable(),
      referenceId: z.coerce.string().nullable(),
      countryName: z.string().nullable(),
      signatureDate: z.string().nullable(),
    }),
  ),

  customerEmail: z.string().nullable(),

  customerDetails: z.object({
    customerId: z.number(),
    customerNumber: z.string().nullable(),
    companyName: z.string().nullable(),
    firstName: z.string().nullable(),
    middleName: z.string().nullable(),
    lastName: z.string().nullable(),
    dateOfbirth: z.string().nullable(),
    address1: z.string().nullable(),
    address2: z.string().nullable(),
    zipCode: z.string().nullable(),
    city: z.string().nullable(),
    stateId: z.number().nullable(),
    countryId: z.number().nullable(),
    hPhone: z.string().nullable(),
    bPhone: z.string().nullable(),
    cPhone: z.string().nullable(),
    fax: z.string().nullable(),
    licenseNumber: z.string().nullable(),
    licenseCategory: z.string().nullable(),
    email: z.string().nullable(),
    hstNumber: z.string().nullable(),
    active: z.boolean(),
    countryName: z.string().nullable(),
    stateName: z.string().nullable(),
    stateCode: z.string().nullable(),
    insuranceCompany: z.string().nullable(),
    policyNumber: z.string().nullable(),
    insuranceExpiryDate: z.string().nullable(),
    insuranceCountry: z.coerce.string().nullable(),
    insuranceProvince: z.coerce.string().nullable(),
    creditCardType: z.string().nullable(),
    creditCardNo: z.string().nullable(),
    creditCardExpiryDate: z.string().nullable(),
    creditCardCVSNo: z.string().nullable(),
    insuranceState: z.string().nullable(),
    billingAddress1: z.string().nullable(),
    billingCity: z.string().nullable(),
    billingZipCord: z.any(),
    insuranceClaim: z.any(),
    billStateName: z.string().nullable(),
    billingStateId: z.coerce.string().nullable(),
    billingCountyId: z.coerce.string().nullable(),
    customerType: z.string().nullable(),
    billCountryName: z.string().nullable(),
    password: z.string().nullable(),
    licenseIssueDate: z.string().nullable(),
    licenseExpiryDate: z.string().nullable(),
    licenseIssueState: z.string().nullable(),
    passportNo: z.string().nullable(),
    passportIssueDate: z.string().nullable(),
    passportExpairyDate: z.string().nullable(),
    locationId: z.number().nullable(),
    locationName: z.string().nullable(),
    creditCardBillingZipCode: z.string().nullable(),
    rateName: z.string().nullable(),
    productionName: z.string().nullable(),
    nameOnCard: z.string().nullable(),
    customerImage: z.string().nullable(),
    drivingExperience: z.string().nullable(),
    isBlackListed: z.boolean(),
    blackListId: z.number(),
    blackListDescription: z.string().nullable(),
    blackListDate: z.string().nullable(),
    blackListReason: z.number(),
    licenseCountryId: z.number().nullable(),
    accoutNameInBank: z.string().nullable(),
    accountNumber: z.string().nullable(),
    bsb: z.any(),
    emergencyContactNo: z.string().nullable(),
    companyRegNo: z.string().nullable(),
    isSMSOpted: z.boolean(),
    isEmailOpted: z.boolean(),
    qboReferenceId: z.coerce.string().nullable(),
    ticketFlag: z.number().nullable(),
    createdBy: z.number().nullable(),
    userName: z.string().nullable(),
    totalRows: z.number(),
    rowNum: z.number(),
    paymentTerms: z.number().nullable(),
    isTaxExempt: z.boolean(),
    licenseCountryName: z.string().nullable(),
    bankName: z.string().nullable(),
    bankSwiftCode: z.string().nullable(),
    createdByName: z.string().nullable(),
    lastUpdatedBy: z.number().nullable(),
    phone: z.string().nullable(),
    lastUpdatedByName: z.string().nullable(),
    insuranceCountryName: z.string().nullable(),
    insuranceProvinceName: z.string().nullable(),
    locationIds: z.any(),
    countryCode: z.string().nullable(),
    licenseStateCode: z.string().nullable(),
    dmsid: z.any().nullable(),
    insuranceCompanyName: z.string().nullable(),
    insuranceCompanyAddress: z.string().nullable(),
    insuranceContactPhone: z.string().nullable(),
    insuranceContactEmail: z.string().nullable(),
    customerImageList: z.array(z.any()),
    employmentType: z.string().nullable(),
    brokerName: z.string().nullable(),
    brokerAddress: z.string().nullable(),
    brokerPhone: z.string().nullable(),
    brokerEmail: z.string().nullable(),
  }),
  agreementEquipment: z
    .array(
      z.object({
        equiptmentID: z.number().nullable(),
        originalEquiptmentID: z.number().nullable(),
        agreementID: z.number().nullable(),
        equipmentType: z.number().nullable(),
        note: z.string().nullable(),
        condition: z.string().nullable(),
        createdBy: z.number().nullable(),
        createdDate: z.string().nullable(),
        lastupdatedBy: z.number().nullable(),
        lastUpdateDate: z.string().nullable(),
        equipmentDelivryDate: z.string().nullable(),
        equipmentDelivryDateStr: z.string().nullable(),
        equipmentReturnDate: z.string().nullable(),
        equipmentReturnDateStr: z.string().nullable(),
        equipmentTypeName: z.string().nullable(),
        isDelete: z.boolean(),
      }),
    )
    .nullable(),

  promotionList: z
    .array(
      z.object({
        promotionID: z.number().nullable(),
        promotionCountNumber: z.string().nullable(),
        promotionCode: z.string().nullable(),
        promotionDiscount: z.number().nullable(),
        promotionIssue: z.string().nullable(),
        promotionListId: z.number().nullable(),
        orderNo: z.number().nullable(),
        minimumDay: z.number().nullable(),
        startDate: z.string().nullable(),
        endDate: z.string().nullable(),
        vehicleTypeId: z.number().nullable(),
        locationId: z.number().nullable(),
        applicableTo: z.coerce.string().nullable(),
        promotionId: z.number().nullable(),
        discountTypeNo: z.number().nullable(),
        discountType: z.string().nullable(),
        discountValue: z.number().nullable(),
        isAutoApply: z.boolean(),
        milesAllowedDiscountType: z.number().nullable(),
        milesAllowedDiscountValue: z.number().nullable(),
        minimnumTotal: z.number().nullable(),
        discountTotal: z.number().nullable(),
      }),
    )
    .nullable(),

  agreementInsurance: z
    .object({
      insurenceDetId: z.number().nullable(),
      insuranceCompanyId: z.number().nullable(),
      agreementId: z.number().nullable(),
      insuranceCompanyName: z.string().nullable(),
      policyNo: z.string().nullable(),
      stateId: z.number().nullable(),
      countryId: z.number().nullable(),
      expiryDate: z.string().nullable(),
      updatedBy: z.number().nullable(),
      updatedDate: z.string().nullable(),
      claimNo: z.string().nullable(),
      contactName: z.string().nullable(),
      contactPhone: z.string().nullable(),
      insurenceType: z.number(),
      stateName: z.string().nullable(),
      insurancePersonName: z.string().nullable(),
      accidnetVehicleInformation: z.string().nullable(),
      dol: z.string().nullable(),
      afnaf: z.string().nullable(),
      perDayAllowance: z.number(),
      numberOfDayAllowed: z.number(),
      maximumAllowance: z.number(),
      adjusterEmail: z.string().nullable(),
      statusId: z.number(),
      isSameInsuranceAsDriver: z.boolean(),
      reservationId: z.number().nullable(),
      collisionDeductible: z.string().nullable(),
      verifiedBy: z.string().nullable(),
      maximumDaysForApproval: z.number(),
      creditCard: z.any(),
      insuranceCompanyID: z.number().nullable(),
      insurenceCompanyName: z.string().nullable(),
      insuranceCompanyIDClaim: z.coerce.string().nullable(),
      insurenceCompanyNameClaim: z.string().nullable(),
      expiryDateStrClaim: z.string().nullable(),
      policyNoClaim: z.string().nullable(),
      includingTax: z.boolean(),
    })
    .nullable(),

  agreementBillingList: z.array(
    z.object({
      billingInfoId: z.number(),
      agreementId: z.number(),
      contactName: z.string().nullable(),
      contactAddress: z.string().nullable(),
      contactPhone: z.string().nullable(),
      contactEmail: z.string().nullable(),
      isActive: z.boolean(),
      billingBy: z.string().nullable(),
      billingOwnerId: z.number().nullable(),
    }),
  ),

  creditCards: z.array(
    z.object({
      creditCardId: z.number(),
      nameOnCard: z.string().nullable(),
      creditCardType: z.string().nullable(),
      creditCardNo: z.string().nullable(),
      creditCardExpiryDate: z.string().nullable(),
      creditCardCVSNo: z.string().nullable(),
      creditCardBillingZipCode: z.string().nullable(),
      gatewayMandateID: z.coerce.string().nullable(),
      gatewayRedirectFlow: z.coerce.string().nullable(),
      gatewayCustomerID: z.coerce.string().nullable(),
      isActive: z.boolean(),
      lastUpdateby: z.number().nullable(),
      referenceId: z.coerce.string().nullable(),
      referenceTypeId: z.number().nullable(),
      year: z.number(),
      month: z.number(),
      isTokenized: z.boolean().nullable(),
      customerID: z.number().nullable(),
    }),
  ),

  agreementAttribute: z.array(
    z.object({
      keyValueId: z.number(),
      agreementId: z.number(),
      attributeId: z.number(),
      value: z.any(),
      groupId: z.number().nullable(),
      groupName: z.string().nullable(),
      keyValue: z.string().nullable(),
      type: z.string(), // Textbox, DateTime Picker, Textox-Number
      displayName: z.string().nullable(),
    }),
  ),

  referralDetails: z.any(),

  mischargeList: z.array(AgreementMiscChargeItem).nullable(),

  createdBy: z.number(),
  agreementStatusName: z.string().nullable(),
  signatureImageUrl: z.string().nullable(),
  reservationId: z.number(),
  isLoanerAgreement: z.boolean(),
  checkoutState: z.number(),
  checkinstate: z.number(),
  postAdjustments: z.number().nullable(),
  writeOffAmount: z.number().nullable(),

  deductibleMiscCharge: z
    .array(
      z.object({
        mischargeOptionID: z.number().nullable(),
        misChargeID: z.number().nullable(),
        name: z.coerce.string().nullable(),
        value: z.coerce.string().nullable(),
        clientId: z.number().nullable(),
        option: z.coerce.string().nullable(),
        vehicleType: z.coerce.string().nullable(),
        unit: z.coerce.string().nullable(),
        locationID: z.coerce.string().nullable(),
      }),
    )
    .nullable(),

  vehicleExchanges: z.array(z.any()),

  referralCalculationType: z.number(),
  signatureDate: z.string().nullable(),
});
export type AgreementDataParsed = z.infer<typeof AgreementDataSchema>;