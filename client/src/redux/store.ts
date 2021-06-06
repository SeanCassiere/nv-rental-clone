import { configureStore, getDefaultMiddleware, Reducer, AnyAction, combineReducers } from "@reduxjs/toolkit";
import { LOCAL_STORAGE_FUNCTIONS } from "../utils/functions";

import authUserSlice from "./slices/authUser";
import SearchAgreementsSlice from "./slices/searchAgreements";

const combinedReducer = combineReducers({
	authUser: authUserSlice,
	searchAgreements: SearchAgreementsSlice,
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

export type RootState = ReturnType<typeof combinedReducer>;

export const selectAuthUserState = (state: RootState) => state.authUser;
export const selectSearchAgreementsState = (state: RootState) => state.searchAgreements;

export default store;
