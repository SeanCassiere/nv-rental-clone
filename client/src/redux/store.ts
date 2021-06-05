import { configureStore } from "@reduxjs/toolkit";

import authUserSlice from "./slices/authUser";
import SearchAgreementsSlice from "./slices/searchAgreements";

const store = configureStore({
	reducer: {
		authUser: authUserSlice,
		searchAgreements: SearchAgreementsSlice,
	},
});

type RootState = ReturnType<typeof store.getState>;

export const selectAuthUserState = (state: RootState) => state.authUser;
export const selectSearchAgreementsState = (state: RootState) => state.searchAgreements;

export default store;
