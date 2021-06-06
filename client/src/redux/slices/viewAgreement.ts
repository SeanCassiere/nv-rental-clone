import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AgreementDataFull } from "../../interfaces/agreement";

import { fakeViewAgreementData } from "../../utils/fakeData";

interface ViewAgreementSliceState {
	agreement: AgreementDataFull | null;
	isSearching: boolean;
	isError: boolean;
	error: string;
	lastRanSearch: string | null;
}

const initialStateData: ViewAgreementSliceState = {
	agreement: fakeViewAgreementData,
	isSearching: false,
	isError: false,
	error: "",
	lastRanSearch: null,
};

export const viewAgreementsSlice = createSlice({
	name: "viewAgreement",
	initialState: initialStateData,
	reducers: {
		refreshAgreementSummary: (state, action: PayloadAction<string>) => {
			state.lastRanSearch = action.payload;
		},
	},
});

export const { refreshAgreementSummary } = viewAgreementsSlice.actions;

export default viewAgreementsSlice.reducer;
