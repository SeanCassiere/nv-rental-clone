import { createSlice } from "@reduxjs/toolkit";
import { ReservationViewDataFull } from "../../interfaces/reservations";

import { fetchReservationThunk, fetchReservationPDFThunk } from "../thunks/viewReservationThunks";

interface ViewReservationSliceState {
	reservation: ReservationViewDataFull | null;
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
			state.printPDF = { url: null, isPrinting: false };
		},
	},
	extraReducers: (builder) => {
		//Fetch Reservation Data
		builder.addCase(fetchReservationThunk.pending, (state) => {
			state.isSearching = true;
			state.reservation = null;
			state.isError = false;
			state.error = "";
		});
		builder.addCase(fetchReservationThunk.fulfilled, (state, action) => {
			state.reservation = action.payload;
			state.isSearching = false;
		});
		builder.addCase(fetchReservationThunk.rejected, (state, action) => {
			if (action.error.message !== "Aborted") {
				state.isError = true;
				state.error = action.error.message as string;
			}
			state.reservation = null;
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
