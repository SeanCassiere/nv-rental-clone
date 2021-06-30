export interface AgreementSummary {
	baseRate: number;
	totalDays: number;
	miscCharges: [];
	totalMiscChargesTaxable: number;
	totalMiscChargesNonTaxable: number;
	subTotal: number;
	totalTax: number;
	dropOffCharges: number;
	total: number;
	promotionDiscount: number;
	rateSummaryItems: {
		type: string;
		rate: number;
		units: number;
		startDate: string;
		endDate: string;
		kMorMileageAllowed: number;
	}[];
	avgPerDayRate: number;
	taxes: {
		taxId: number;
		locationTaxId: number;
		name: string;
		description: string;
		value: number;
		isOption: false;
		isDeleted: false;
		isDefaultSelectedForReservation: boolean;
		misChargeId: string | null;
	}[];
	promotions: null;
	maxTotalDays: number;
	freeMiles: number;
	extraMilesCharge: number;
	initialCharge: number;
	initialChargeHours: number;
	avgPerHourRate: number;
	advancePayment: number | null;
	balanceDue: number;
	inventoryCharges: number | null;
	totalInventoryChargesTaxable: number;
	totalInventoryChargesNonTaxable: number;
	finalBaseRate: number;
}
