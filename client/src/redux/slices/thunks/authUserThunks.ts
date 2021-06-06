import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { LOCAL_STORAGE_FUNCTIONS } from "../../../utils/functions";
import { RootState } from "../../store";
import { AuthReturn, RefreshReturn, JWTReturnAuthToken } from "../../../interfaces/authentication";

const AUTH_URL = process.env.REACT_APP_SERVER_URL || "";

export const loginUserThunk = createAsyncThunk("authUser/fetchLogin", async (_, thunkApi) => {
	const response = await axios.get(`${AUTH_URL}/users/login`);

	if (response.status !== 200) {
		return thunkApi.rejectWithValue(response.statusText);
	}

	const data = response.data as AuthReturn;

	try {
		LOCAL_STORAGE_FUNCTIONS.setTokenToLocalStorage(data.token);
		LOCAL_STORAGE_FUNCTIONS.setRefreshTokenToLocalStorage(data.refreshToken);
	} catch (error) {
		return thunkApi.rejectWithValue("Could not save the tokens to local storage");
	}

	try {
		const decoded: JWTReturnAuthToken = jwtDecode(data.token);
		const { client_navotar_clientid, client_navotar_userid, exp } = decoded;
		return {
			token: data.token,
			refreshToken: data.refreshToken,
			clientId: client_navotar_clientid,
			userId: client_navotar_userid,
			tokenExpiresAt: exp,
		};
	} catch (error) {
		return thunkApi.rejectWithValue("Could not decode the access token");
	}
});

export const refreshAuthTokenThunk = createAsyncThunk("authUser/fetchNewAccessToken", async (_, thunkApi) => {
	const state = thunkApi.getState() as RootState;
	const { refreshToken } = state.authUser;

	const response = await axios.get(`${AUTH_URL}/users/navotar/refresh`, {
		headers: { Authorization: `Bearer ${refreshToken}` },
	});

	if (response.status !== 200) {
		return thunkApi.rejectWithValue(
			"There was an error refreshing your access token, you will be logged out in less than 30 seconds"
		);
	}

	const data = response.data as RefreshReturn;

	try {
		LOCAL_STORAGE_FUNCTIONS.setTokenToLocalStorage(data.token);
	} catch (error) {
		return thunkApi.rejectWithValue("Could not save the tokens to local storage");
	}

	try {
		const decoded: JWTReturnAuthToken = jwtDecode(data.token);
		const { exp } = decoded;
		return {
			token: data.token,
			tokenExpiresAt: exp,
		};
	} catch (error) {
		return thunkApi.rejectWithValue("Could not decode the access token");
	}
});
