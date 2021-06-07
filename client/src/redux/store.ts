import { configureStore, getDefaultMiddleware, Reducer, AnyAction, combineReducers } from "@reduxjs/toolkit";
import { LOCAL_STORAGE_FUNCTIONS } from "../utils/functions";

import authUserSlice from "./slices/authUser";
import searchAgreementsSlice from "./slices/searchAgreements";
import searchCustomersSlice from "./slices/searchCustomers";
import viewAgreementSlice from "./slices/viewAgreement";

const combinedReducer = combineReducers({
	authUser: authUserSlice,
	searchAgreements: searchAgreementsSlice,
	searchCustomers: searchCustomersSlice,
	viewAgreement: viewAgreementSlice,
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
export const selectAuthUserState = (state: RootState) => state.authUser;
export const selectSearchAgreementsState = (state: RootState) => state.searchAgreements;
export const selectSearchCustomersState = (state: RootState) => state.searchCustomers;
export const selectViewAgreementState = (state: RootState) => state.viewAgreement;

export default store;
