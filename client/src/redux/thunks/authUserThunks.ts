import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import jwtDecode from "jwt-decode";
import { Alert } from "rsuite";

import { LOCAL_STORAGE_FUNCTIONS } from "../../utils/functions";
import { RootState } from "../store";
import { AuthReturn, RefreshReturn, JWTReturnAuthToken } from "../../interfaces/authentication";
import { setAuthUserError } from "../slices/authUserSlice";

const AUTH_URL = process.env.REACT_APP_SERVER_URL || "";

export const loginUserThunk = createAsyncThunk(
	"authUser/fetchLogin",
	async ({ username, password }: { username: string; password: string }, thunkApi) => {
		try {
			const { data } = await axios.post<AuthReturn>(`${AUTH_URL}/users/login`, {
				username,
				password,
			});

			try {
				LOCAL_STORAGE_FUNCTIONS.setTokenToLocalStorage(data.token);
				LOCAL_STORAGE_FUNCTIONS.setRefreshTokenToLocalStorage(data.refreshToken);
			} catch (error) {
				Alert.warning("Could not save the tokens to local storage");
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
				Alert.error("Could not decode and save the access token");
				return thunkApi.rejectWithValue("Could not decode and save the access token");
			}
		} catch (error) {
			const err = error as AxiosError;
			thunkApi.dispatch(setAuthUserError(err?.response?.data?.message));
			return thunkApi.rejectWithValue(err?.response?.data?.message);
		}
	}
);

export const refreshAuthTokenThunk = createAsyncThunk("authUser/fetchNewAccessToken", async (_, thunkApi) => {
	const state = thunkApi.getState() as RootState;
	const { refreshToken } = state.authUser;

	const response = await axios.get<RefreshReturn>(`${AUTH_URL}/users/navotar/refresh`, {
		headers: { Authorization: `Bearer ${refreshToken}` },
	});

	if (response.status !== 200) {
		Alert.warning(
			"There was an error refreshing your access token, you will be logged out in less than 30 seconds",
			12000
		);
		return thunkApi.rejectWithValue(
			"There was an error refreshing your access token, you will be logged out in less than 30 seconds"
		);
	}

	const data = response.data;

	try {
		LOCAL_STORAGE_FUNCTIONS.setTokenToLocalStorage(data.token);
	} catch (error) {
		Alert.warning("Could not save the refreshed token to local storage");
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
		Alert.error("Could not decode and save the access token");
		return thunkApi.rejectWithValue("Could not decode the access token");
	}
});
