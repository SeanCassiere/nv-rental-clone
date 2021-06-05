import axios, { AxiosError } from "axios";
import dotenv from "dotenv";
import { AuthReturn } from "../../interfaces/interfaces";

dotenv.config();

const AUTH_URL = process.env.AUTH_URL ?? "";
/**
 * @desc Fetch Navotar V3 API Token
 * @route NONE Navotar V3 AUTH URL
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
		if (err && err.response) {
			const axiosErr = err as AxiosError;
			throw new Error(axiosErr.response?.data?.error);
		}
	}

	return token;
};

export { getNavotarAccessToken };
