import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LOCAL_STORAGE_FUNCTIONS } from "../../utils/functions";

interface AuthUserSliceState {
	token: string;
	tokenExpiresAt: number | null;
	isLoggedIn: boolean;
	isAuthenticating: boolean;
	userId: string | null;
	clientId: string | null;
}

let initialStateData: AuthUserSliceState;
initialStateData = {
	token: "",
	tokenExpiresAt: null,
	isLoggedIn: false,
	isAuthenticating: false,
	userId: null,
	clientId: null,
};

const callLocal = LOCAL_STORAGE_FUNCTIONS.getTokenFromLocalStorage();
if (callLocal) {
	initialStateData = {
		token: callLocal.token,
		tokenExpiresAt: callLocal.tokenExpiresAt,
		isLoggedIn: true,
		isAuthenticating: false,
		userId: callLocal.userId,
		clientId: callLocal.clientId,
	};
}

export const authUserSlice = createSlice({
	name: "authUser",
	initialState: initialStateData,
	reducers: {
		logInUser: (
			state,
			action: PayloadAction<{
				token: string;
				tokenExpiresAt: number;
				userId: string;
				clientId: string;
			}>
		) => {
			state.isLoggedIn = true;
			state.token = action.payload.token;
			state.tokenExpiresAt = action.payload.tokenExpiresAt;
			state.userId = action.payload.userId;
			state.clientId = action.payload.clientId;
			state.isAuthenticating = false;
		},
		logOutUser: (state) => {
			state.token = "";
			state.isLoggedIn = false;
			state.userId = null;
			state.clientId = null;
			state.tokenExpiresAt = null;
		},
		isAuth: (state, action: PayloadAction<boolean>) => {
			state.isAuthenticating = action.payload;
		},
	},
});

export const { logInUser, logOutUser, isAuth } = authUserSlice.actions;

export default authUserSlice.reducer;
