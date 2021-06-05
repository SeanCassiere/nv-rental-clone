import axios, { AxiosError } from "axios";
import jwtDecode from "jwt-decode";
import { LOCAL_STORAGE_PREFIX } from "../utils/functions";

const AUTH_URL = process.env.REACT_APP_AUTH_URL ?? "";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID ?? "";
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET ?? "";

interface AuthReturn {
	access_token: string;
	expires_in: number;
	token_type: string;
	scope: string;
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
	userId: string;
	clientId: string;
	tokenExpiresAt: number | null;
}> => {
	const params = new URLSearchParams();
	params.append("grant_type", "client_credentials");
	params.append("client_id", CLIENT_ID);
	params.append("client_secret", CLIENT_SECRET);
	params.append("scope", "Api");

	let responseToken = "";

	try {
		const { data } = await axios.post(AUTH_URL, params, {
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
		});
		const { access_token } = data as AuthReturn;

		localStorage.setItem(`${LOCAL_STORAGE_PREFIX}_TOKEN`, access_token);

		responseToken = access_token;
	} catch (err) {
		if (err && err.response) {
			const axiosErr = err as AxiosError;
			throw new Error(axiosErr.response?.data?.error);
		}
	}

	try {
		const decoded: JWTReturnAuthToken = jwtDecode(responseToken);
		const { client_navotar_clientid, client_navotar_userid, exp } = decoded;
		return {
			token: responseToken,
			clientId: client_navotar_clientid,
			userId: client_navotar_userid,
			tokenExpiresAt: exp,
		};
	} catch (error) {
		throw new Error("Could not decode the access token!");
	}
};

export { performAuth };
