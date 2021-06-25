import { createSlice } from "@reduxjs/toolkit";
import { ReservationViewDataFull } from "../../interfaces/reservations";

import { fetchReservationThunk } from "../thunks/viewReservationThunks";

interface ViewReservationSliceState {
	reservation: ReservationViewDataFull | null;
	isSearching: boolean;
	isError: boolean;
	error: string;
}

const initialStateData: ViewReservationSliceState = {
	reservation: null,
	isSearching: false,
	isError: false,
	error: "",
};

export const viewAReservationSlice = createSlice({
	name: "viewReservation",
	initialState: initialStateData,
	reducers: {
		clearViewReservationState: (state) => {
			state.reservation = null;
		},
	},
	extraReducers: (builder) => {
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
	},
});

export const { clearViewReservationState } = viewAReservationSlice.actions;

export default viewAReservationSlice.reducer;
