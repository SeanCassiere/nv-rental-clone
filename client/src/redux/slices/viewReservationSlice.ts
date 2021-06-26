import { createSlice } from "@reduxjs/toolkit";

import { ReservationViewDataFull } from "../../interfaces/reservations/reservationView";
import { ReservationSummaryResponseFull } from "../../interfaces/reservations/reservationSummary";

import { fetchReservationPDFThunk, fetchViewReservationByIdThunk } from "../thunks/viewReservationThunks";

interface ViewReservationSliceState {
	reservation: ReservationViewDataFull | null;
	reservationSummary: ReservationSummaryResponseFull | null;
	isSearching: boolean;
	isError: boolean;
	error: string;
	printPDF: {
		url: string | null;
		isPrinting: boolean;
	};
}

const initialStateData: ViewReservationSliceState = {
	reservation: null,
	reservationSummary: null,
	isSearching: false,
	isError: false,
	error: "",
	printPDF: {
		url: null,
		isPrinting: false,
	},
};

export const viewAReservationSlice = createSlice({
	name: "viewReservation",
	initialState: initialStateData,
	reducers: {
		clearViewReservationState: (state) => {
			state.reservation = null;
			state.reservationSummary = null;
			state.printPDF = { url: null, isPrinting: false };
		},
	},
	extraReducers: (builder) => {
		//Fetch Reservation By Id
		builder.addCase(fetchViewReservationByIdThunk.pending, (state) => {
			state.reservation = null;
			state.reservationSummary = null;
			state.isSearching = true;
			state.isError = false;
			state.error = "";
		});
		builder.addCase(fetchViewReservationByIdThunk.rejected, (state, action) => {
			state.isSearching = false;
			state.isError = true;
			state.error = action?.error?.message as string;
		});
		builder.addCase(fetchViewReservationByIdThunk.fulfilled, (state, action) => {
			state.reservation = action.payload.reservationView;
			state.reservationSummary = action.payload.reservationSummary;
			state.isSearching = false;
		});
		// Fetch Reservation PDF
		builder.addCase(fetchReservationPDFThunk.pending, (state) => {
			state.printPDF.isPrinting = true;
			state.printPDF.url = null;
		});
		builder.addCase(fetchReservationPDFThunk.fulfilled, (state, action) => {
			state.printPDF.url = action.payload;
			state.printPDF.isPrinting = false;
		});
		builder.addCase(fetchReservationPDFThunk.rejected, (state) => {
			state.printPDF.isPrinting = false;
		});
	},
});

export const { clearViewReservationState } = viewAReservationSlice.actions;

export default viewAReservationSlice.reducer;
