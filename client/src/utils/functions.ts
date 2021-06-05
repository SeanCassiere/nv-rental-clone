import jwtDecode from "jwt-decode";
import { JWTReturnAuthToken } from "../api/authApi";

export const LOCAL_STORAGE_PREFIX = "NAV_GHI";

const getTokenFromLocalStorage = (): {
	token: string;
	refreshToken: string;
	userId: string;
	clientId: string;
	tokenExpiresAt: number;
} | null => {
	const fromStorage = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}_TOKEN`) ?? null;
	const fromStorageRefresh = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}_REFRESH_TOKEN`) ?? null;

	if (fromStorage === null) return null;
	if (fromStorageRefresh === null) return null;

	try {
		const { client_navotar_clientid, client_navotar_userid, exp } = jwtDecode(fromStorage) as JWTReturnAuthToken;

		const secondsSinceEpoch = Math.round(Date.now() / 1000);
		if (secondsSinceEpoch >= exp) {
			localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}_TOKEN`);
			return null;
		}

		return {
			token: fromStorage,
			refreshToken: fromStorageRefresh,
			userId: client_navotar_userid,
			clientId: client_navotar_clientid,
			tokenExpiresAt: exp,
		};
	} catch (_) {
		return null;
	}
};

const LOCAL_STORAGE_FUNCTIONS = { getTokenFromLocalStorage };

export { LOCAL_STORAGE_FUNCTIONS };
