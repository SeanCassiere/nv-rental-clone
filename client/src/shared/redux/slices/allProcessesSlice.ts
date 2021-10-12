import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { CustomersInList } from "../../interfaces/customers/customerSearch";
import { AgreementInList } from "../../interfaces/agreements/agreementSearch";
import { VehiclesInList } from "../../interfaces/vehicles/vehicleSearch";
import { ReservationsInList } from "../../interfaces/reservations/reservationSearch";
import { XPagination } from "../../interfaces/pagination/pagination";

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

const initialPagination: XPagination = {
	totalCount: 25,
	pageSize: 25,
	currentPage: 1,
	totalPages: 1,
	previousPageLink: null,
	nextPageLink: null,
};

interface AllProcesses {
	searchCustomers: ProcessInterface<{ customers: CustomersInList[]; pagination: XPagination }>;
	searchVehicles: ProcessInterface<{ vehicles: VehiclesInList[]; pagination: XPagination }>;
	searchAgreements: ProcessInterface<{ agreements: AgreementInList[]; pagination: XPagination }>;
	searchReservations: ProcessInterface<{ reservations: ReservationsInList[]; pagination: XPagination }>;
	fetchWidgetsList: ProcessInterface<null>;
	fetchSalesStatusStatistics: ProcessInterface<null>;
}

let allProcessesInitialState: AllProcesses;

allProcessesInitialState = {
	searchCustomers: populateEmptyProcess<{ customers: CustomersInList[]; pagination: XPagination }>({
		customers: [],
		pagination: initialPagination,
	}),
	searchVehicles: populateEmptyProcess<{ vehicles: VehiclesInList[]; pagination: XPagination }>({
		vehicles: [],
		pagination: initialPagination,
	}),
	searchAgreements: populateEmptyProcess<{ agreements: AgreementInList[]; pagination: XPagination }>({
		agreements: [],
		pagination: initialPagination,
	}),
	searchReservations: populateEmptyProcess<{ reservations: ReservationsInList[]; pagination: XPagination }>({
		reservations: [],
		pagination: initialPagination,
	}),
	fetchWidgetsList: populateEmptyProcess<null>(null),
	fetchSalesStatusStatistics: populateEmptyProcess<null>(null),
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
		setSearchAgreementsData: (
			state,
			action: PayloadAction<{ agreements: AgreementInList[]; pagination: XPagination }>
		) => {
			state.searchAgreements.data.agreements = action.payload.agreements;
			state.searchAgreements.data.pagination = action.payload.pagination;
		},
		setSearchCustomersData: (
			state,
			action: PayloadAction<{ customers: CustomersInList[]; pagination: XPagination }>
		) => {
			state.searchCustomers.data.customers = action.payload.customers;
			state.searchCustomers.data.pagination = action.payload.pagination;
		},
		setSearchVehiclesData: (state, action: PayloadAction<{ vehicles: VehiclesInList[]; pagination: XPagination }>) => {
			state.searchVehicles.data.vehicles = action.payload.vehicles;
			state.searchVehicles.data.pagination = action.payload.pagination;
		},
		setSearchReservationsData: (
			state,
			action: PayloadAction<{ reservations: ReservationsInList[]; pagination: XPagination }>
		) => {
			state.searchReservations.data.reservations = action.payload.reservations;
			state.searchReservations.data.pagination = action.payload.pagination;
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
