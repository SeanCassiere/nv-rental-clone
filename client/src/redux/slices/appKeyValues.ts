import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AgreementStatus, ReservationStatus, VehicleStatus } from "../../interfaces/statuses";

import {
	fetchReservationStatusesThunk,
	fetchAgreementStatusesThunk,
	fetchVehicleStatusesThunk,
} from "../thunks/appKeyValuesThunks";

interface AppKeyValuesSliceState {
	reservationValues: {
		reservationStatuses: ReservationStatus[];
		error: string | null;
	};
	agreementValues: {
		agreementStatuses: AgreementStatus[];
		error: string | null;
	};
	vehicleValues: {
		vehicleStatuses: VehicleStatus[];
		error: string | null;
	};
}

const initialStateData: AppKeyValuesSliceState = {
	reservationValues: {
		reservationStatuses: [],
		error: null,
	},
	agreementValues: {
		agreementStatuses: [],
		error: null,
	},
	vehicleValues: {
		vehicleStatuses: [],
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
		setAgreementStatuses: (state, action: PayloadAction<AgreementStatus[]>) => {
			state.agreementValues.agreementStatuses = action.payload;
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
		builder.addCase(fetchAgreementStatusesThunk.rejected, (state, action) => {
			state.agreementValues.agreementStatuses = [];
			state.agreementValues.error = action.error?.message as string;
		});
		builder.addCase(fetchAgreementStatusesThunk.fulfilled, (state, action) => {
			state.agreementValues.agreementStatuses = action.payload;
			state.agreementValues.error = null;
		});
		builder.addCase(fetchVehicleStatusesThunk.rejected, (state, action) => {
			state.vehicleValues.vehicleStatuses = [];
			state.vehicleValues.error = action.error?.message as string;
		});
		builder.addCase(fetchVehicleStatusesThunk.fulfilled, (state, action) => {
			state.vehicleValues.vehicleStatuses = action.payload;
			state.vehicleValues.error = null;
		});
	},
});

export const { setReservationStatuses, setAgreementStatuses } = appKeyValuesSlice.actions;

export default appKeyValuesSlice.reducer;
