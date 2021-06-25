import { createSlice } from "@reduxjs/toolkit";
import { ReservationViewDataFull } from "../../interfaces/reservations";

import { fakeViewReservation } from "../../utils/fakeData2";
// import { fetchAgreementThunk } from "../thunks/viewAgreementThunks";

interface ViewReservationSliceState {
	reservation: ReservationViewDataFull | null;
	isSearching: boolean;
	isError: boolean;
	error: string;
}

const initialStateData: ViewReservationSliceState = {
	reservation: fakeViewReservation,
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
		// builder.addCase(fetchAgreementThunk.pending, (state) => {
		// 	state.isSearching = true;
		// 	state.agreement = null;
		// 	state.isError = false;
		// 	state.error = "";
		// });
		// builder.addCase(fetchAgreementThunk.fulfilled, (state, action) => {
		// 	state.agreement = action.payload.agreement;
		// 	state.isSearching = false;
		// });
		// builder.addCase(fetchAgreementThunk.rejected, (state, action) => {
		// 	if (action.error.message !== "Aborted") {
		// 		state.isError = true;
		// 		state.error = action.error.message as string;
		// 	}
		// 	state.agreement = null;
		// });
	},
});

export const { clearViewReservationState } = viewAReservationSlice.actions;

export default viewAReservationSlice.reducer;
