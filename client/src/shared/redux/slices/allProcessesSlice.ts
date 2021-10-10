import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { CustomersInList } from "../../interfaces/customers/customerSearch";
import { AgreementInList } from "../../interfaces/agreements/agreementSearch";
import { VehiclesInList } from "../../interfaces/vehicles/vehicleSearch";
import { ReservationsInList } from "../../interfaces/reservations/reservationSearch";

interface ProcessInterface<T> {
	isProcessing: boolean;
	success: boolean;
	isError: boolean;
	errorMsg: string | null;
	errorData: any | null;
	lastRun: string | null;
	data: T;
}

function populateEmptyProcess<T>(initial: T) {
	const data = {
		isProcessing: false,
		success: false,
		isError: false,
		errorMsg: null,
		errorData: null,
		lastRun: null,
		data: initial,
	};
	return data;
}

interface AllProcesses {
	searchCustomers: ProcessInterface<CustomersInList[]>;
	searchVehicles: ProcessInterface<VehiclesInList[]>;
	searchAgreements: ProcessInterface<AgreementInList[]>;
	searchReservations: ProcessInterface<ReservationsInList[]>;
}

let allProcessesInitialState: AllProcesses;

allProcessesInitialState = {
	searchCustomers: populateEmptyProcess<CustomersInList[]>([]),
	searchVehicles: populateEmptyProcess<VehiclesInList[]>([]),
	searchAgreements: populateEmptyProcess<AgreementInList[]>([]),
	searchReservations: populateEmptyProcess<ReservationsInList[]>([]),
};

export const allProcessesSlice = createSlice({
	name: "allProcesses",
	initialState: allProcessesInitialState,
	reducers: {
		resetProcess: (state, action: PayloadAction<keyof AllProcesses>) => {
			state[action.payload].isProcessing = false;
			state[action.payload].success = false;
			state[action.payload].isError = false;
			state[action.payload].errorMsg = null;
			state[action.payload].errorData = false;
		},
		setProcessLoading: (state, action: PayloadAction<keyof AllProcesses>) => {
			state[action.payload].success = false;
			state[action.payload].isProcessing = true;
		},
		setProcessSuccess: (state, action: PayloadAction<{ key: keyof AllProcesses; date: string }>) => {
			state[action.payload.key].success = true;
			state[action.payload.key].isProcessing = false;
			state[action.payload.key].lastRun = action.payload.date;
			state[action.payload.key].isError = false;
			state[action.payload.key].errorMsg = null;
			state[action.payload.key].errorData = false;
		},
		setLastRanDate: (state, action: PayloadAction<{ key: keyof AllProcesses; date: string }>) => {
			state[action.payload.key].lastRun = action.payload.date;
		},
		setProcessError: (state, action: PayloadAction<{ key: keyof AllProcesses; data: any; msg: string }>) => {
			state[action.payload.key].isProcessing = false;
			state[action.payload.key].isError = true;
			state[action.payload.key].errorMsg = action.payload.msg;
			state[action.payload.key].errorData = action.payload.data;
		},
		setSearchAgreementsData: (state, action: PayloadAction<AgreementInList[]>) => {
			state.searchAgreements.data = action.payload;
		},
		setSearchCustomersData: (state, action: PayloadAction<CustomersInList[]>) => {
			state.searchCustomers.data = action.payload;
		},
		setSearchVehiclesData: (state, action: PayloadAction<VehiclesInList[]>) => {
			state.searchVehicles.data = action.payload;
		},
		setSearchReservationsData: (state, action: PayloadAction<ReservationsInList[]>) => {
			state.searchReservations.data = action.payload;
		},
	},
});

export const {
	resetProcess,
	setProcessLoading,
	setProcessSuccess,
	setProcessError,
	setLastRanDate,
	setSearchAgreementsData,
	setSearchCustomersData,
	setSearchVehiclesData,
	setSearchReservationsData,
} = allProcessesSlice.actions;

export default allProcessesSlice;
