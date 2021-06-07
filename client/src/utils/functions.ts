import jwtDecode from "jwt-decode";
import { JWTReturnAuthToken, NavotarClientFeature } from "../interfaces/authentication";
import { ThemeOptions } from "../redux/slices/appConfigSlice";

export const LOCAL_STORAGE_PREFIX = "NAV_GHI";

const getThemeFromLocalStorage = (): ThemeOptions => {
	const themeFromStorage = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}_THEME`) || null;
	if (themeFromStorage) {
		if (themeFromStorage === "dark") return "dark";
	}
	return "light";
};

const getTokenFromLocalStorage = (): {
	token: string;
	refreshToken: string;
	userId: string;
	clientId: string;
	tokenExpiresAt: number;
	clientFeatures: NavotarClientFeature[];
} | null => {
	const fromStorage = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}_TOKEN`) ?? null;
	const fromStorageRefresh = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}_REFRESH_TOKEN`) ?? null;
	const fromStorageClientFeatures = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}_CLIENT_FEATURES`) ?? null;

	if (fromStorage === null) return null;
	if (fromStorageRefresh === null) return null;
	if (fromStorageClientFeatures === null) return null;

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
			clientFeatures: JSON.parse(fromStorageClientFeatures),
		};
	} catch (_) {
		return null;
	}
};

const clearLocalStorageTokens = () => {
	localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}_TOKEN`);
	localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}_REFRESH_TOKEN`);
	localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}_CLIENT_FEATURES`);
};

const setTokenToLocalStorage = (token: string): boolean => {
	try {
		localStorage.setItem(`${LOCAL_STORAGE_PREFIX}_TOKEN`, token);
		return true;
	} catch (error) {
		return false;
	}
};

const setRefreshTokenToLocalStorage = (refreshToken: string) => {
	try {
		localStorage.setItem(`${LOCAL_STORAGE_PREFIX}_REFRESH_TOKEN`, refreshToken);
		return true;
	} catch (error) {
		return false;
	}
};

const setClientFeaturesToLocalStorage = (features: NavotarClientFeature[]) => {
	try {
		localStorage.setItem(`${LOCAL_STORAGE_PREFIX}_CLIENT_FEATURES`, JSON.stringify(features));
		return true;
	} catch (error) {
		return false;
	}
};

const setThemeToLocalStorage = (theme: ThemeOptions) => {
	try {
		localStorage.setItem(`${LOCAL_STORAGE_PREFIX}_THEME`, theme);
		return true;
	} catch (error) {
		return false;
	}
};

const LOCAL_STORAGE_FUNCTIONS = {
	getTokenFromLocalStorage,
	clearLocalStorageTokens,
	setTokenToLocalStorage,
	setRefreshTokenToLocalStorage,
	setClientFeaturesToLocalStorage,
	getThemeFromLocalStorage,
	setThemeToLocalStorage,
};

export { LOCAL_STORAGE_FUNCTIONS };
