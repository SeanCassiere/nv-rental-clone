import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VehicleStatus } from "../../interfaces/vehicles/vehicleStatus";
import { AgreementStatus } from "../../interfaces/agreements/agreementStatus";
import { ReservationStatus } from "../../interfaces/reservations/reservationStatus";
import { ReservationType } from "../../interfaces/reservations/reservationType";
import { AgreementType } from "../../interfaces/agreements/agreementType";
import { VehicleTypeShort } from "../../interfaces/vehicles/vehicleType";

import {
	fetchReservationStatusesThunk,
	fetchReservationTypesThunk,
	fetchAgreementStatusesThunk,
	fetchAgreementTypesThunk,
	fetchVehicleStatusesThunk,
	fetchVehicleTypesShortThunk,
	fetchAvailableReportFolders,
	fetchAvailableReports,
} from "../thunks/appKeyValuesThunks";
import { IR_ReportFolder } from "../../interfaces/reports/folder";
import { IR_AvailableReport } from "../../interfaces/reports/availableReport";

interface AppKeyValuesSliceState {
	reservationValues: {
		reservationStatuses: ReservationStatus[];
		reservationTypes: ReservationType[];
	};
	agreementValues: {
		agreementStatuses: AgreementStatus[];
		agreementTypes: AgreementType[];
	};
	vehicleValues: {
		vehicleStatuses: VehicleStatus[];
		vehicleTypes: VehicleTypeShort[];
	};
	reportValues: {
		reportFolders: IR_ReportFolder[];
		reportsAvailable: IR_AvailableReport[];
	};
}

const initialStateData: AppKeyValuesSliceState = {
	reservationValues: {
		reservationStatuses: [],
		reservationTypes: [],
	},
	agreementValues: {
		agreementStatuses: [],
		agreementTypes: [],
	},
	vehicleValues: {
		vehicleStatuses: [],
		vehicleTypes: [],
	},
	reportValues: {
		reportFolders: [],
		reportsAvailable: [],
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
		builder.addCase(fetchReservationStatusesThunk.rejected, (state) => {
			state.reservationValues.reservationStatuses = [];
		});
		builder.addCase(fetchReservationStatusesThunk.fulfilled, (state, action) => {
			state.reservationValues.reservationStatuses = action.payload;
		});
		builder.addCase(fetchReservationTypesThunk.rejected, (state) => {
			state.reservationValues.reservationStatuses = [];
		});
		builder.addCase(fetchReservationTypesThunk.fulfilled, (state, action) => {
			state.reservationValues.reservationTypes = action.payload;
		});
		//Agreement Key Values
		builder.addCase(fetchAgreementStatusesThunk.rejected, (state) => {
			state.agreementValues.agreementStatuses = [];
		});
		builder.addCase(fetchAgreementStatusesThunk.fulfilled, (state, action) => {
			state.agreementValues.agreementStatuses = action.payload;
		});
		builder.addCase(fetchAgreementTypesThunk.rejected, (state) => {
			state.agreementValues.agreementTypes = [];
		});
		builder.addCase(fetchAgreementTypesThunk.fulfilled, (state, action) => {
			state.agreementValues.agreementTypes = action.payload;
		});
		//Vehicle Key Values
		builder.addCase(fetchVehicleStatusesThunk.rejected, (state) => {
			state.vehicleValues.vehicleStatuses = [];
		});
		builder.addCase(fetchVehicleStatusesThunk.fulfilled, (state, action) => {
			state.vehicleValues.vehicleStatuses = action.payload;
		});
		builder.addCase(fetchVehicleTypesShortThunk.rejected, (state) => {
			state.vehicleValues.vehicleTypes = [];
		});
		builder.addCase(fetchVehicleTypesShortThunk.fulfilled, (state, action) => {
			state.vehicleValues.vehicleTypes = action.payload;
		});
		// Reports -> Folders
		builder.addCase(fetchAvailableReportFolders.rejected, (state) => {
			state.reportValues.reportFolders = [];
		});
		builder.addCase(fetchAvailableReportFolders.fulfilled, (state, action) => {
			state.reportValues.reportFolders = action.payload;
		});
		// Reports -> Reports
		builder.addCase(fetchAvailableReports.rejected, (state) => {
			state.reportValues.reportsAvailable = [];
		});
		builder.addCase(fetchAvailableReports.fulfilled, (state, action) => {
			state.reportValues.reportsAvailable = action.payload;
		});
	},
});

export const { setReservationStatuses, setAgreementStatuses } = appKeyValuesSlice.actions;

export default appKeyValuesSlice;
