import { createSlice } from "@reduxjs/toolkit";
import { AgreementDataFull } from "../../interfaces/agreement";

import { fetchAgreementThunk } from "./thunks/viewAgreementThunks";

interface ViewAgreementSliceState {
	agreement: AgreementDataFull | null;
	isSearching: boolean;
	isError: boolean;
	error: string;
}

const initialStateData: ViewAgreementSliceState = {
	agreement: null,
	isSearching: false,
	isError: false,
	error: "",
};

export const viewAgreementsSlice = createSlice({
	name: "viewAgreement",
	initialState: initialStateData,
	reducers: {
		clearViewAgreementState: (state) => {
			state.agreement = null;
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
		});
		builder.addCase(fetchAgreementThunk.rejected, (state, action) => {
			if (action.error.message !== "Aborted") {
				state.isError = true;
				state.error = action.error.message as string;
			}
			state.agreement = null;
		});
	},
});

export const { clearViewAgreementState } = viewAgreementsSlice.actions;

export default viewAgreementsSlice.reducer;
