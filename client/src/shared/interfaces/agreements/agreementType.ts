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
