import { configureStore, getDefaultMiddleware, Reducer, AnyAction, combineReducers } from "@reduxjs/toolkit";
import { LOCAL_STORAGE_FUNCTIONS } from "../utils/functions";

import authUserSlice from "./slices/authUserSlice";
import searchAgreementsSlice from "./slices/searchAgreementsSlice";
import searchCustomersSlice from "./slices/searchCustomersSlice";
import viewAgreementSlice from "./slices/viewAgreementSlice";
import appConfigSlice from "./slices/appConfigSlice";
import searchReservationsSlice from "./slices/searchReservationsSlice";

const combinedReducer = combineReducers({
	appConfig: appConfigSlice,
	authUser: authUserSlice,
	searchAgreements: searchAgreementsSlice,
	viewAgreement: viewAgreementSlice,
	searchCustomers: searchCustomersSlice,
	searchReservations: searchReservationsSlice,
});

const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
	if (action.type === "authUser/logOutUser") {
		LOCAL_STORAGE_FUNCTIONS.clearLocalStorageTokens();
		state = undefined as RootState;
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
export const selectAuthUserState = (state: RootState) => state.authUser;
export const selectSearchAgreementsState = (state: RootState) => state.searchAgreements;
export const selectSearchReservationsState = (state: RootState) => state.searchReservations;
export const selectSearchCustomersState = (state: RootState) => state.searchCustomers;
export const selectViewAgreementState = (state: RootState) => state.viewAgreement;

export default store;
