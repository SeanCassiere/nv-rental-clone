export interface ReservationType {
	typeId: number;
	typeName: string;
	calculationType: string;
	laguages: string | null;
	isDefault: boolean;
	abbreviation: string;
	isFront: boolean;
	isDeleted: boolean;
	isPossibleDelete: boolean;
	isAddedByCustomer: boolean;
}
