import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import appAxiosInstance from "../../api/appAxiosInstance";
import { AgreementInList } from "../../interfaces/agreement";
import { RootState } from "../store";

export const fetchAgreementsThunk = createAsyncThunk<
	{ agreements: AgreementInList[]; lastRunSearch: string },
	{ limit: number },
	{ rejectValue: string }
>("searchAgreements/fetchAgreements", async ({ limit }, thunkApi) => {
	const source = axios.CancelToken.source();
	thunkApi.signal.addEventListener("abort", () => source.cancel());

	const state = thunkApi.getState() as RootState;
	const authUser = state.authUser;

	const response = await appAxiosInstance.get(`/Agreements`, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${authUser.token}`,
		},
		params: {
			ClientId: authUser.clientId,
			UserId: authUser.userId,
			Page: 1,
			PageSize: limit,
		},
		cancelToken: source.token,
	});

	if (response.status !== 200) return thunkApi.rejectWithValue(response.statusText);

	const currentDateTime = new Date();
	return { agreements: response.data as AgreementInList[], lastRunSearch: currentDateTime.toUTCString() };
});
