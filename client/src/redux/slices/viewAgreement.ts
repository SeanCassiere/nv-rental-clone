import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AgreementDataFull } from "../../interfaces/agreement";

import { fetchAgreementThunk } from "./thunks/viewAgreementThunks";

interface ViewAgreementSliceState {
	agreement: AgreementDataFull | null;
	isSearching: boolean;
	isError: boolean;
	error: string;
	lastRanSearch: string | null;
}

const initialStateData: ViewAgreementSliceState = {
	agreement: null,
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
	extraReducers: (builder) => {
		builder.addCase(fetchAgreementThunk.pending, (state) => {
			state.isSearching = true;
			state.agreement = null;
			state.isError = false;
			state.error = "";
		});
		builder.addCase(fetchAgreementThunk.fulfilled, (state, action) => {
			state.agreement = action.payload.agreement;
			state.isSearching = false;
			state.lastRanSearch = action.payload.lastRunSearch;
		});
		builder.addCase(fetchAgreementThunk.rejected, (state, action) => {
			console.log(action.error);
			if (action.error.message !== "Aborted") {
				state.isError = true;
				state.error = action.error.message as string;
			}
			state.agreement = null;
		});
	},
});

export const { refreshAgreementSummary } = viewAgreementsSlice.actions;

export default viewAgreementsSlice.reducer;
