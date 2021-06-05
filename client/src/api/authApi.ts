import axios, { AxiosError } from "axios";
import jwtDecode from "jwt-decode";
import { LOCAL_STORAGE_PREFIX } from "../utils/functions";

const AUTH_URL = process.env.REACT_APP_SERVER_URL || "";

interface AuthReturn {
	token: string;
	refreshToken: string;
	message: string;
}

interface RefreshReturn {
	token: string;
	refreshToken: string;
	message: string;
}

export interface JWTReturnAuthToken {
	aud: string;
	client_id: string;
	client_navotar_clientid: string;
	client_navotar_userid: string;
	exp: number;
	iat: number;
	iss: string;
	jti: string;
	nbf: number;
}

const performAuth = async (): Promise<{
	token: string;
	refreshToken: string;
	userId: string;
	clientId: string;
	tokenExpiresAt: number | null;
}> => {
	let tokenResponse = "";
	let refreshTokenResponse = "";

	try {
		const { data } = await axios.get(`${AUTH_URL}/users/login`);
		const { token, refreshToken } = data as AuthReturn;

		localStorage.setItem(`${LOCAL_STORAGE_PREFIX}_TOKEN`, token);
		localStorage.setItem(`${LOCAL_STORAGE_PREFIX}_REFRESH_TOKEN`, refreshToken);

		tokenResponse = token;
		refreshTokenResponse = refreshToken;
	} catch (err) {
		if (err && err.response) {
			const axiosErr = err as AxiosError;
			throw new Error(axiosErr.response?.data?.error);
		}
	}

	try {
		const decoded: JWTReturnAuthToken = jwtDecode(tokenResponse);
		const { client_navotar_clientid, client_navotar_userid, exp } = decoded;
		return {
			token: tokenResponse,
			refreshToken: refreshTokenResponse,
			clientId: client_navotar_clientid,
			userId: client_navotar_userid,
			tokenExpiresAt: exp,
		};
	} catch (error) {
		throw new Error("Could not decode the access token!");
	}
};

const refreshAuth = async (): Promise<{
	token: string;
	tokenExpiresAt: number | null;
}> => {
	let tokenResponse = "";

	try {
		const { data } = await axios.get(`${AUTH_URL}/users/navotar/refresh`);
		const { token } = data as RefreshReturn;

		localStorage.setItem(`${LOCAL_STORAGE_PREFIX}_TOKEN`, token);

		tokenResponse = token;
	} catch (err) {
		if (err && err.response) {
			const axiosErr = err as AxiosError;
			throw new Error(axiosErr.response?.data?.error);
		}
	}

	try {
		const decoded: JWTReturnAuthToken = jwtDecode(tokenResponse);
		const { exp } = decoded;
		return {
			token: tokenResponse,
			tokenExpiresAt: exp,
		};
	} catch (error) {
		throw new Error("Could not decode the access token!");
	}
};

export { performAuth, refreshAuth };
