import axios, { AxiosError } from "axios";
import dotenv from "dotenv";
import { AuthReturn, NavotarClientFeature } from "../../interfaces/interfaces";

dotenv.config();

const AUTH_URL = process.env.AUTH_URL ?? "";
/**
 * @desc Fetch Navotar V3 API Token
 * @route POST Navotar V3 AUTH URL
 * @access PRIVATE
 */
const getNavotarAccessToken = async (ClientID: string, ClientSecret: string): Promise<string> => {
	let token = "";

	const params = new URLSearchParams();
	params.append("grant_type", "client_credentials");
	params.append("client_id", ClientID);
	params.append("client_secret", ClientSecret);
	params.append("scope", "Api");

	try {
		const { data } = await axios.post(AUTH_URL, params, {
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
		});
		const { access_token } = data as AuthReturn;
		token = access_token;
	} catch (err) {
		const axiosErr = err as AxiosError;
		throw new Error(axiosErr.response?.data?.error);
	}

	return token;
};

/**
 * @desc Fetch Navotar account features
 * @route POST Navotar V3 BASE URL/Clients/:clientId/ClientFeatures
 * @access PRIVATE
 */
const getClientFeatures = async (NavotarClientID: string, token: string) => {
	const headers = {
		"Content-Type": "application/json",
		Authorization: `Bearer ${token}`,
	};
	try {
		const { data } = await axios.post(
			`${process.env.BASE_URL}/Clients/${NavotarClientID}/ClientFeatures`,
			{},
			{ headers }
		);
		const features = data as NavotarClientFeature[];
		return features;
	} catch (error) {
		throw new Error("Could not fetch your Navotar account features");
	}
};

export { getNavotarAccessToken, getClientFeatures };
