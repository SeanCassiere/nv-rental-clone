import axios from "axios";
import { AgreementInList } from "../interfaces/agreement";
const BASE_URL = process.env.REACT_APP_BASE_URL ?? "";

export const getAgreementsInList = async ({
	token,
	clientId,
	userId,
}: {
	token: string;
	clientId: string;
	userId: string;
}): Promise<{
	agreements: AgreementInList[];
}> => {
	try {
		const res = await axios.get(`${BASE_URL}/Agreements`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			params: {
				ClientId: clientId,
				UserId: userId,
				PageSize: 10,
			},
		});

		const data = res.data as AgreementInList[];
		return { agreements: data };
	} catch (error) {
		throw new Error("Could not access the requested resource.");
	}
};
