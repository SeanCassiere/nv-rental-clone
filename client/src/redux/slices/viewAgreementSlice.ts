import { createSlice } from "@reduxjs/toolkit";
import { AgreementDataFull } from "../../interfaces/agreements/agreementView";

import { fetchAgreementThunk, fetchAgreementPDFThunk } from "../thunks/viewAgreementThunks";

interface ViewAgreementSliceState {
	agreement: AgreementDataFull | null;
	isSearching: boolean;
	isError: boolean;
	error: string;
	printPDF: {
		url: string | null;
		isPrinting: boolean;
	};
}

const initialStateData: ViewAgreementSliceState = {
	agreement: null,
	isSearching: false,
	isError: false,
	error: "",
	printPDF: {
		url: null,
		isPrinting: false,
	},
};

export const viewAgreementsSlice = createSlice({
	name: "viewAgreement",
	initialState: initialStateData,
	reducers: {
		clearViewAgreementState: (state) => {
			state.agreement = null;
			state.printPDF = { url: null, isPrinting: false };
		},
	},
	extraReducers: (builder) => {
		// Fetch Agreement Thunk
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
		// Fetch Agreement PDF
		builder.addCase(fetchAgreementPDFThunk.pending, (state) => {
			state.printPDF.isPrinting = true;
			state.printPDF.url = null;
		});
		builder.addCase(fetchAgreementPDFThunk.fulfilled, (state, action) => {
			state.printPDF.url = action.payload;
			state.printPDF.isPrinting = false;
		});
		builder.addCase(fetchAgreementPDFThunk.rejected, (state) => {
			state.printPDF.isPrinting = false;
		});
	},
});

export const { clearViewAgreementState } = viewAgreementsSlice.actions;

export default viewAgreementsSlice.reducer;
