import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { AgreementDataFull } from "../../../interfaces/agreement";
import { RootState } from "../../store";

const BASE_URL = process.env.REACT_APP_BASE_URL || "";

export const fetchAgreementThunk = createAsyncThunk("viewAgreement/fetchAgreement", async (id: string, thunkApi) => {
	const source = axios.CancelToken.source();
	thunkApi.signal.addEventListener("abort", () => source.cancel());

	const state = thunkApi.getState() as RootState;
	const authUser = state.authUser;

	const response = await axios.get(`${BASE_URL}/Agreements/${id}`, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${authUser.token}`,
		},
		params: {
			clientId: authUser.clientId,
		},
		cancelToken: source.token,
	});

	if (response.status !== 200) return thunkApi.rejectWithValue(response.statusText);

	const currentDateTime = new Date();
	return { agreement: response.data as AgreementDataFull, lastRunSearch: currentDateTime.toUTCString() };
});
