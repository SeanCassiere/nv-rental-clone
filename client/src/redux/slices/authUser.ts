import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LOCAL_STORAGE_FUNCTIONS } from "../../utils/functions";
import { loginUserThunk, refreshAuthTokenThunk } from "./thunks/authUserThunks";

interface AuthUserSliceState {
	token: string;
	refreshToken: string;
	tokenExpiresAt: number | null;
	isLoggedIn: boolean;
	isAuthenticating: boolean;
	userId: string | null;
	clientId: string | null;
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
	error: null,
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
		error: null,
	};
}

export const authUserSlice = createSlice({
	name: "authUser",
	initialState: initialStateData,
	reducers: {
		isAuth: (state, action: PayloadAction<boolean>) => {
			state.isAuthenticating = action.payload;
		},
		refreshAccessToken: (state, action: PayloadAction<{ token: string; tokenExpiresAt: number }>) => {
			state.token = action.payload.token;
			state.tokenExpiresAt = action.payload.tokenExpiresAt;
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
			if (action.payload) {
				state.token = action.payload.token;
				state.refreshToken = action.payload.refreshToken;
				state.clientId = action.payload.clientId;
				state.userId = action.payload.userId;
				state.isLoggedIn = true;
			}
		});
		builder.addCase(loginUserThunk.rejected, (state, action) => {
			if (action.payload) {
				state.error = action.payload as string;
				state.isAuthenticating = false;
			}
		});
		builder.addCase(refreshAuthTokenThunk.fulfilled, (state, action) => {
			state.token = action.payload.token;
			state.tokenExpiresAt = action.payload.tokenExpiresAt;
		});
		builder.addCase(refreshAuthTokenThunk.rejected, (state, action) => {
			state.error = action.payload as string;
		});
	},
});

export const { refreshAccessToken } = authUserSlice.actions;

export default authUserSlice.reducer;
