export interface ReservationType {
	typeId: number;
	typeName: string;
	calculationType: string;
	laguages: string | null;
	isDefault: boolean;
	abbreviation: string | null;
	isFront: boolean;
	isDeleted: boolean;
	isPossibleDelete: boolean;
	isAddedByCustomer: boolean;
}

export interface AgreementType {
	typeId: number;
	typeName: string;
	calculationType: string;
	laguages: string | null;
	isDefault: boolean;
	abbreviation: string | null;
	isFront: boolean;
	isDeleted: boolean;
	isPossibleDelete: boolean;
	isAddedByCustomer: boolean;
}

export interface VehicleTypeShort {
	id: number;
	value: string;
}
