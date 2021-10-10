import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LOCAL_STORAGE_FUNCTIONS } from "../../utils/functions";
import { loginUserThunk, refreshAuthTokenThunk } from "../thunks/authUserThunks";

interface AuthUserSliceState {
	token: string;
	refreshToken: string;
	tokenExpiresAt: number | null;
	isLoggedIn: boolean;
	isAuthenticating: boolean;
	userId: string | null;
	clientId: string | null;
	permissions: string[];
	error: string | null;
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
	permissions: [],
	error: null,
};

const callLocal = LOCAL_STORAGE_FUNCTIONS.getTokenFromLocalStorage();
if (callLocal) {
	initialStateData = {
		...initialStateData,
		token: callLocal.token,
		refreshToken: callLocal.refreshToken,
		tokenExpiresAt: callLocal.tokenExpiresAt,
		isLoggedIn: true,
		isAuthenticating: false,
		userId: callLocal.userId,
		clientId: callLocal.clientId,
		error: null,
	};
}

export const authUserSlice = createSlice({
	name: "authUser",
	initialState: initialStateData,
	reducers: {
		refreshAccessToken: (state, action: PayloadAction<{ token: string; tokenExpiresAt: number }>) => {
			state.token = action.payload.token;
			state.tokenExpiresAt = action.payload.tokenExpiresAt;
		},
		resetAuthState: (state) => {
			state.token = "";
			state.refreshToken = "";
			state.tokenExpiresAt = null;
			state.isLoggedIn = false;
			state.isAuthenticating = false;
			state.userId = null;
			state.clientId = null;
			state.error = null;
		},
		setAuthUserError: (state, action: PayloadAction<string>) => {
			state.error = action.payload;
		},
		setAuthUserPermissions: (state, action: PayloadAction<Array<string>>) => {
			state.permissions = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(loginUserThunk.pending, (state) => {
			state.isAuthenticating = true;
			state.token = "";
			state.refreshToken = "";
			state.userId = "";
			state.clientId = "";
			state.tokenExpiresAt = null;
			state.error = null;
		});
		builder.addCase(loginUserThunk.fulfilled, (state, action) => {
			state.token = action.payload.token;
			state.refreshToken = action.payload.refreshToken;
			state.clientId = action.payload.clientId;
			state.userId = action.payload.userId;
			state.isLoggedIn = true;
			state.isAuthenticating = false;
		});
		builder.addCase(loginUserThunk.rejected, (state) => {
			state.isAuthenticating = false;
		});
		builder.addCase(refreshAuthTokenThunk.fulfilled, (state, action) => {
			state.token = action.payload.token;
			state.tokenExpiresAt = action.payload.tokenExpiresAt;
		});
		builder.addCase(refreshAuthTokenThunk.rejected, (state, action: any) => {
			state.error = action as string;
			state.isAuthenticating = false;
		});
	},
});

export const { refreshAccessToken, resetAuthState, setAuthUserError, setAuthUserPermissions } = authUserSlice.actions;

export default authUserSlice.reducer;
