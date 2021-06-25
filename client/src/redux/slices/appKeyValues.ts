import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AgreementStatus, ReservationStatus, VehicleStatus } from "../../interfaces/statuses";
import { ReservationType } from "../../interfaces/types";

import {
	fetchReservationStatusesThunk,
	fetchReservationTypesThunk,
	fetchAgreementStatusesThunk,
	fetchVehicleStatusesThunk,
} from "../thunks/appKeyValuesThunks";

interface AppKeyValuesSliceState {
	reservationValues: {
		reservationStatuses: ReservationStatus[];
		reservationTypes: ReservationType[];
	};
	agreementValues: {
		agreementStatuses: AgreementStatus[];
	};
	vehicleValues: {
		vehicleStatuses: VehicleStatus[];
	};
}

const initialStateData: AppKeyValuesSliceState = {
	reservationValues: {
		reservationStatuses: [],
		reservationTypes: [],
	},
	agreementValues: {
		agreementStatuses: [],
	},
	vehicleValues: {
		vehicleStatuses: [],
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
		//Reservation Key Values
		builder.addCase(fetchReservationStatusesThunk.rejected, (state, action) => {
			state.reservationValues.reservationStatuses = [];
		});
		builder.addCase(fetchReservationStatusesThunk.fulfilled, (state, action) => {
			state.reservationValues.reservationStatuses = action.payload;
		});
		builder.addCase(fetchReservationTypesThunk.rejected, (state, action) => {
			state.reservationValues.reservationStatuses = [];
		});
		builder.addCase(fetchReservationTypesThunk.fulfilled, (state, action) => {
			state.reservationValues.reservationTypes = action.payload;
		});
		//Agreement Key Values
		builder.addCase(fetchAgreementStatusesThunk.rejected, (state, action) => {
			state.agreementValues.agreementStatuses = [];
		});
		builder.addCase(fetchAgreementStatusesThunk.fulfilled, (state, action) => {
			state.agreementValues.agreementStatuses = action.payload;
		});
		//Vehicle Key Values
		builder.addCase(fetchVehicleStatusesThunk.rejected, (state, action) => {
			state.vehicleValues.vehicleStatuses = [];
		});
		builder.addCase(fetchVehicleStatusesThunk.fulfilled, (state, action) => {
			state.vehicleValues.vehicleStatuses = action.payload;
		});
	},
});

export const { setReservationStatuses, setAgreementStatuses } = appKeyValuesSlice.actions;

export default appKeyValuesSlice.reducer;
