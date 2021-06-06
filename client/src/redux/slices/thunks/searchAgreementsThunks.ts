import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { AgreementInList } from "../../../interfaces/agreement";
import { RootState } from "../../store";

const BASE_URL = process.env.REACT_APP_BASE_URL || "";

export const fetchAgreementsThunk = createAsyncThunk<
	{ agreements: AgreementInList[]; lastRunSearch: string },
	{ limit: number },
	{ rejectValue: string }
>("searchAgreements/fetchAgreements", async ({ limit }, thunkApi) => {
	const state = thunkApi.getState() as RootState;
	const authUser = state.authUser;

	const response = await axios.get(`${BASE_URL}/Agreements`, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${authUser.token}`,
		},
		params: {
			ClientId: authUser.clientId,
			UserId: authUser.userId,
			PageSize: limit,
		},
	});

	if (response.status === 400) thunkApi.rejectWithValue(response.statusText);
	if (response.status === 401) thunkApi.rejectWithValue(response.statusText);
	if (response.status === 500) thunkApi.rejectWithValue(response.statusText);

	const currentDateTime = new Date();
	return { agreements: response.data as AgreementInList[], lastRunSearch: currentDateTime.toUTCString() };
});
