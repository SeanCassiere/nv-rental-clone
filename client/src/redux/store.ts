import { configureStore, getDefaultMiddleware, Reducer, AnyAction, combineReducers } from "@reduxjs/toolkit";
import { LOCAL_STORAGE_FUNCTIONS } from "../utils/functions";

import authUserSlice from "./slices/authUserSlice";
import appKeyValuesSlice from "./slices/appKeyValues";
import searchAgreementsSlice from "./slices/searchAgreementsSlice";
import searchCustomersSlice from "./slices/searchCustomersSlice";
import viewAgreementSlice from "./slices/viewAgreementSlice";
import appConfigSlice from "./slices/appConfigSlice";
import searchReservationsSlice from "./slices/searchReservationsSlice";
import createReservationSlice from "./slices/createReservationSlice";
import searchVehiclesSlice from "./slices/searchVehiclesSlice";
import viewReservationSlice from "./slices/viewReservationSlice";

const combinedReducer = combineReducers({
	appConfig: appConfigSlice,
	appKeyValues: appKeyValuesSlice,
	authUser: authUserSlice,
	searchAgreements: searchAgreementsSlice,
	viewAgreement: viewAgreementSlice,
	searchCustomers: searchCustomersSlice,
	searchReservations: searchReservationsSlice,
	viewReservation: viewReservationSlice,
	createReservation: createReservationSlice,
	searchVehicles: searchVehiclesSlice,
});

const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
	if (action.type === "authUser/logOutUser") {
		LOCAL_STORAGE_FUNCTIONS.clearLocalStorageTokens();
		return combinedReducer(undefined, action);
	}
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
export const selectAppKeyValuesState = (state: RootState) => state.appKeyValues;
export const selectAuthUserState = (state: RootState) => state.authUser;
export const selectSearchAgreementsState = (state: RootState) => state.searchAgreements;
export const selectViewAgreementState = (state: RootState) => state.viewAgreement;
export const selectSearchCustomersState = (state: RootState) => state.searchCustomers;
export const selectSearchReservationsState = (state: RootState) => state.searchReservations;
export const selectViewReservationState = (state: RootState) => state.viewReservation;
export const selectCreateReservationState = (state: RootState) => state.createReservation;
export const selectSearchVehiclesState = (state: RootState) => state.searchVehicles;

export default store;
