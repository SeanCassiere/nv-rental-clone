import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReservationStatus } from "../../interfaces/statuses";

import { fetchReservationStatusesThunk } from "../thunks/appKeyValuesThunks";

interface AppKeyValuesSliceState {
	reservationValues: {
		reservationStatuses: ReservationStatus[];
		error: string | null;
	};
}

const initialStateData: AppKeyValuesSliceState = {
	reservationValues: {
		reservationStatuses: [],
		error: null,
	},
};

export const appKeyValuesSlice = createSlice({
	name: "appKeyValues",
	initialState: initialStateData,
	reducers: {
		setReservationStatuses: (state, action: PayloadAction<ReservationStatus[]>) => {
			state.reservationValues.reservationStatuses = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchReservationStatusesThunk.rejected, (state, action) => {
			state.reservationValues.reservationStatuses = [];
			state.reservationValues.error = action.error.message as string;
		});
		builder.addCase(fetchReservationStatusesThunk.fulfilled, (state, action) => {
			state.reservationValues.reservationStatuses = action.payload;
			state.reservationValues.error = null;
		});
	},
});

export const { setReservationStatuses } = appKeyValuesSlice.actions;

export default appKeyValuesSlice.reducer;
