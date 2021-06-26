export interface ReservationsInList {
	ReserveId: number;
	AdditionalCharge: number;
	ReservationNumber: string;
	ReservationType: string | null;
	OwningLocationId: number | null;
	LowestRate: boolean | null;
	ClientId: number;
	CustomerId: number;
	VehicleId: number | null;
	VehicleMakeName: string | null;
	Trim: string | null;
	Year: number | null;
	StartDate: string;
	EndDate: string;
	CreatedDate: string;
	Notes: string | null;
	LicenseNo: string | null;
	VehicleNo: string | null;
	FuelType: string | null;
	FuelLevel: string | null;
	Transmission: string | null;
	CurrentOdometer: number | null;
	Color: string | null;
	Doors: number | null;
	Vin: string | null;
	StatusId: number;
	InsuranceAmt: number | null;
	StartLocationId: number;
	StartLocationName: string | null;
	StartLocationAddress1: string | null;
	StartLocationAddress2: string | null;
	StartLocationCity: string | null;
	StartLocationPhone: string | null;
	StartLocationCountryName: string | null;
	StartLocationStateName: string | null;
	EndLocationId: number;
	EndLocationName: string | null;
	FirstName: string | null;
	LastName: string | null;
	Address1: string | null;
	Address2: string | null;
	City: string | null;
	ProductionName: string | null;
	CountryName: string | null;
	ZipCode: string | null;
	DateOfBirth: string | null;
	CustomerType: string | null;
	Phone: string | null;
	hPhone: string | null;
	bPhone: string | null;
	cPhone: string | null;
	Email: string | null;
	Company: string | null;
	VehicleTypeId: number;
	VehicleType: string;
	ModelId: number;
	ModelName: string;
	CanceledDate: string | null;
	BasePrice: number;
	Note: string | null;
	AgreementId: number | null;
	AgreementNumber: string | null;
	CancellationCharge: number | null;
	AdvancedPayment: number;
	CreditCardExpiryDate: string | null;
	CreditCardNo: string | null;
	CreditCardType: string | null;
	CreditCardCVSNo: string | null;
	LDW: number;
	TLDW: number;
	SpecialNote: string | null;
	PromotionId: number;
	Deposit: number;
	LogId: number;
	CreditCardBillingZipCode: string | null;
	ImageName: string | null;
	TotalDays: number;
	IsCompound: boolean;
	FullDepositAmount: number;
	InstallmentAmount: number;
	PerInstallmentAmount: number;
	InstallmentQty: number;
	PreAdjustment: number;
	ReservationPrimaryId: number;
	Prep: boolean;
	Wrap: boolean;
	VehicleTypeId2: number | null;
	VehicleId2: number | null;
	VehicleMakeName2: string | null;
	ModelName2: string | null;
	Year2: number | null;
	LicenseNo2: string | null;
	VehicleNo2: string | null;
	VehicleType2: string | null;
	PONo: string | null;
	RONo: string | null;
	PONo2: string | null;
	RONo2: string | null;
	TotalDiscount: number;
	LocationId: number;
	DaysInWeek: number;
	CreatedBy: string | null;
	LastUpdateByName: string | null;
	ReservationStatus: number;
	IsRetrieval: boolean;
	IsDelivery: boolean;
	ProjectedMileage: number | null;
	ReferralId: number | null;
	VoucherNo: string | null;
	LocationEmail: string | null;
	LocationEmailName: null;
	ReferralCommission: number;
}

export interface ReservationMiscViewDataFull {
	miscChargeId: number;
	miscChargeCode: number;
	unit: number;
	name: string;
	description: string;
	calculationType: "Fixed" | "Perday";
	taxNotAvailable: boolean;
	isCommission: boolean;
	value: number;
	totalValue: number;
	startDate: string;
	endDate: string;
	quantity: number;
	createdDate: string | null;
	gLcode: string | null;
	locationMiscChargeId: number;
	isChargeByPeriod: boolean;
	isTaxable: boolean;
	locationTaxIds: string | null;
	isSelected: boolean;
	isQuantity: boolean;
	locationMiscChargeID: number;
	vehicleTypeId: number;
	miscChargeID: number;
	misChargeCode: number;
	isOptional: boolean;
	printValue: number | null;
	oldStartDateString: string | null;
	oldEndDateString: string | null;
	startDateString: string | null;
	createddateString: string | null;
	endDateString: string | null;
	isDeleted: boolean;
	isFreeze: boolean;
	isAlreadySelected: boolean;
	isDeductible: boolean;
	locationId: number;
	locationName: string | null;
	vehicleType: number | null;
	miscTaxList: string | null;
	totaltax: number;
	subTotal: number;
	amountPaid: number | null;
	amountRemaining: number | null;
	miscchargeTypeId: number;
	option: number;
	misChargeOptionList: string | null;
	optionId: number | null;
}
export interface ReservationViewDataFull {
	reservationview: {
		reserveId: number;
		additionalCharge: number;
		reservationNumber: string | null;
		reservationType: string | null;
		owningLocationId: number;
		lowestRate: null;
		clientId: number;
		customerId: number;
		vehicleId: number;
		vehicleMakeName: string | null;
		trim: string | null;
		year: number;
		startDate: string;
		endDate: string;
		createdDate: string | null;
		notes: string | null;
		licenseNo: string | null;
		vehicleNo: string | null;
		fuelType: string | null;
		fuelLevel: string | null;
		transmission: string | null;
		currentOdometer: number;
		color: string | null;
		doors: number | null;
		vin: string | null;
		statusId: number;
		insuranceAmt: number | null;
		startLocationId: number;
		startLocationName: string | null;
		startLocationAddress1: string | null;
		startLocationAddress2: string | null;
		startLocationCity: string | null;
		startLocationPhone: string | null;
		startLocationCountryName: string | null;
		startLocationStateName: string | null;
		endLocationId: number;
		endLocationName: string | null;
		firstName: string | null;
		lastName: string | null;
		address1: string | null;
		address2: string | null;
		city: string | null;
		stateCode: string | null;
		productionName: string | null;
		countryName: string;
		zipCode: string | null;
		dateOfBirth: string | null;
		customerType: string | null;
		phone: string | null;
		hPhone: string | null;
		bPhone: string | null;
		cPhone: string | null;
		email: string | null;
		company: string | null;
		vehicleTypeId: number;
		vehicleType: string | null;
		modelId: number;
		modelName: string | null;
		canceledDate: string | null;
		basePrice: number;
		note: string | null;
		agreementId: number | null;
		agreementNumber: string | null;
		cancellationCharge: null;
		advancedPayment: number;
		creditCardExpiryDate: string | null;
		creditCardNo: string | null;
		creditCardType: string | null;
		creditCardCVSNo: string | null;
		ldw: number;
		tldw: number;
		specialNote: string | null;
		promotionId: number;
		deposit: number;
		logId: number;
		creditCardBillingZipCode: string | null;
		imageName: string | null;
		totalDays: number;
		isCompound: boolean;
		fullDepositAmount: number;
		installmentAmount: number;
		perInstallmentAmount: number;
		installmentQty: number;
		preAdjustment: number;
		reservationPrimaryId: number;
		prep: boolean;
		wrap: boolean;
		vehicleTypeId2: number | null;
		vehicleId2: number | null;
		vehicleMakeName2: string | null;
		modelName2: string | null;
		year2: number | null;
		licenseNo2: string | null;
		vehicleNo2: string | null;
		vehicleType2: string | null;
		poNo: string | null;
		roNo: string | null;
		poNo2: string | null;
		roNo2: string | null;
		totalDiscount: number;
		locationId: number;
		daysInWeek: number;
		createdBy: string | null;
		lastUpdateByName: string | null;
		reservationStatus: number;
		isRetrieval: boolean;
		isDelivery: boolean;
		projectedMileage: number | null;
		referralId: number | null;
		voucherNo: string | null;
		locationEmail: string | null;
		locationEmailName: string | null;
		referralCommission: number;
		totalRows: number;
		createdById: number;
	};
	miscChargeList: ReservationMiscViewDataFull[];
	taxList: {
		taxId: number;
		name: string;
		description: string | null;
		value: number;
		isOption: false;
		isSelected: false;
		locationId: number;
		taxValue: number;
		locationName: string | null;
		locationTaxID: number;
		createdBy: number;
		createdByName: string | null;
		lastUpdatedByName: string | null;
		activeDate: string | null;
		expiryDate: string | null;
		activeDatestr: string | null;
		expiryDatestr: string | null;
		taxSelectedStatus: string | null;
	}[];
	rateDetailsList: [] | null;
	reservationTotal: number | null;
	reservationAttributeList: [];
	paymentList: [];
	clientPdfTemplatesList: string[];
	emailTrackList: [];
	depositTotals: {
		depositAmount: number;
		onHoldAmount: number;
		refundAmount: number;
		releaseAmount: number;
		forfeitureAmount: number;
		totalCanceledAmount: number;
	};
	invoiceList: null;
	reservtionBillingReview: {
		billingInfoID: number;
		reservationID: number;
		contactName: string | null;
		contactAddress: string | null;
		contactPhone: string | null;
		contactEmail: string | null;
		isActive: boolean;
		billingBy: string;
		creditCardReferenceId: number | null;
		billingOwnerId: number;
	};
	reservationBillingList: [];
	mileageCharges: [];
	agreementReservationMileageBreakdown: [];
	navDynamicAttribute: null;
	agreementInsurance: null;
	customerImages: [];
}

export interface ReservationSummaryMisCharge {
	id: number;
	name: string;
	description: string | null;
	calculationType: "Fixed" | "Perday";
	isQuantity: boolean;
	isOptional: boolean;
	isTaxable: boolean;
	value: number;
	total: number;
	locationMiscChargeId: number;
	startDate: string;
	endDate: string;
	quantity: number;
	units: number;
	optionId: number | null;
	optionName: string | null;
	miscChargeType: "Insurance" | "Fuel" | "Other" | "Mileage" | "Fees";
	locationTaxIds: string;
	miscChargeCode: number | null;
	subTotal: number | null;
	totaltax: number | null;
}

export interface ReservationSummaryRateCharge {
	type: string;
	rate: number;
	units: number;
	startDate: string;
	endDate: string;
	kMorMileageAllowed: number | null;
}

export interface ReservationSummaryResponseFull {
	baseRate: number;
	totalDays: number;
	miscCharges: ReservationSummaryMisCharge[];
	totalMiscChargesTaxable: number;
	totalMiscChargesNonTaxable: number;
	subTotal: number;
	totalTax: number;
	dropOffCharges: number;
	total: number;
	promotionDiscount: number;
	rateSummaryItems: ReservationSummaryRateCharge[];
	avgPerDayRate: number;
	taxes: {
		taxId: number;
		locationTaxId: number;
		name: string;
		description: string | null;
		value: number;
		isOption: boolean;
		isDeleted: boolean;
		isDefaultSelectedForReservation: boolean;
		misChargeId: number | null;
	}[];
	promotions: [];
	maxTotalDays: number;
	freeMiles: number;
	extraMilesCharge: number;
	initialCharge: number;
	initialChargeHours: number;
	avgPerHourRate: number;
	advancePayment: number;
	balanceDue: number;
	inventoryCharges: null;
	totalInventoryChargesTaxable: number;
	totalInventoryChargesNonTaxable: number;
	finalBaseRate: number;
	preAdjustment: number | null;
	additionalCharge: number | null;
	postAdjustment: number | null;
}
