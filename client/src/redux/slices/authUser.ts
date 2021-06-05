import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LOCAL_STORAGE_FUNCTIONS } from "../../utils/functions";

interface AuthUserSliceState {
	token: string;
	refreshToken: string;
	tokenExpiresAt: number | null;
	isLoggedIn: boolean;
	isAuthenticating: boolean;
	userId: string | null;
	clientId: string | null;
}

let initialStateData: AuthUserSliceState;
initialStateData = {
	token: "",
	refreshToken: "",
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
		refreshToken: callLocal.refreshToken,
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
				refreshToken: string;
				tokenExpiresAt: number;
				userId: string;
				clientId: string;
			}>
		) => {
			state.isLoggedIn = true;
			state.token = action.payload.token;
			state.refreshToken = action.payload.refreshToken;
			state.tokenExpiresAt = action.payload.tokenExpiresAt;
			state.userId = action.payload.userId;
			state.clientId = action.payload.clientId;
			state.isAuthenticating = false;
		},
		logOutUser: (state) => {
			state.token = "";
			state.refreshToken = "";
			state.isLoggedIn = false;
			state.userId = null;
			state.clientId = null;
			state.tokenExpiresAt = null;
		},
		isAuth: (state, action: PayloadAction<boolean>) => {
			state.isAuthenticating = action.payload;
		},
		refreshAccessToken: (state, action: PayloadAction<{ token: string; tokenExpiresAt: number }>) => {
			state.token = action.payload.token;
			state.tokenExpiresAt = action.payload.tokenExpiresAt;
		},
	},
});

export const { logInUser, logOutUser, isAuth, refreshAccessToken } = authUserSlice.actions;

export default authUserSlice.reducer;
