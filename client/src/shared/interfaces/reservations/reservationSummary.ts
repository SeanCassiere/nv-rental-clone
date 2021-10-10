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
