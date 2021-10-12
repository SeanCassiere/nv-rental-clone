import { configureStore, getDefaultMiddleware, Reducer, AnyAction, combineReducers } from "@reduxjs/toolkit";

import authUserSlice from "./slices/authUserSlice";
import lookupListsSlice from "./slices/lookupListsSlice";
import viewAgreementSlice from "./slices/viewAgreementSlice";
import appConfigSlice from "./slices/appConfigSlice";
import createReservationSlice from "./slices/createReservationSlice";
import viewReservationSlice from "./slices/viewReservationSlice";
import allProcessesSlice from "./slices/allProcessesSlice";
import dashboardSlice from "./slices/dashboardSlice";

const combinedReducer = combineReducers({
	[appConfigSlice.name]: appConfigSlice.reducer,
	[lookupListsSlice.name]: lookupListsSlice.reducer,
	[authUserSlice.name]: authUserSlice.reducer,
	[allProcessesSlice.name]: allProcessesSlice.reducer,
	[dashboardSlice.name]: dashboardSlice.reducer,
	[viewAgreementSlice.name]: viewAgreementSlice.reducer,
	[viewReservationSlice.name]: viewReservationSlice.reducer,
	[createReservationSlice.name]: createReservationSlice.reducer,
});

const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
	// if (action.type === "authUser/logOutUser") { return combinedReducer(undefined, action)}
	return combinedReducer(state, action);
};

const store = configureStore({
	reducer: rootReducer,
	middleware: [...getDefaultMiddleware()],
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof combinedReducer>;

// State Slice Data selectors
export const selectAppConfigState = (state: RootState) => state.appConfig;
export const selectAuthUserState = (state: RootState) => state.authUser;
export const selectViewAgreementState = (state: RootState) => state.viewAgreement;
export const selectViewReservationState = (state: RootState) => state.viewReservation;
export const selectCreateReservationState = (state: RootState) => state.createReservation;

export const selectAppKeyValuesState = (state: RootState) => state.lookupList;
export const selectReportsState = (state: RootState) => state.lookupList.reportValues;

export const selectSearchAgreementsState = (state: RootState) => state.allProcesses.searchAgreements;
export const selectSearchCustomersState = (state: RootState) => state.allProcesses.searchCustomers;
export const selectSearchVehiclesState = (state: RootState) => state.allProcesses.searchVehicles;
export const selectSearchReservationsState = (state: RootState) => state.allProcesses.searchReservations;
export const selectFetchWidgetsList = (state: RootState) => state.allProcesses.fetchWidgetsList;
export const selectFetchSalesStatusStatistics = (state: RootState) => state.allProcesses.fetchSalesStatusStatistics;

export const selectDashboard = (state: RootState) => state.dashboard;

export default store;
