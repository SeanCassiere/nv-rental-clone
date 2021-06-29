import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import appAxiosInstance from "../../api/appAxiosInstance";
import { CustomersInList } from "../../interfaces/customers/customerSearch";
import { RootState } from "../store";

export const fetchCustomersThunk = createAsyncThunk(
	"searchCustomers/fetchCustomers",
	async ({ limit }: { limit: number }, thunkApi) => {
		const source = axios.CancelToken.source();
		thunkApi.signal.addEventListener("abort", () => source.cancel());

		const state = thunkApi.getState() as RootState;
		const authUser = state.authUser;

		const response = await appAxiosInstance.get(`/Customers`, {
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
		return { customers: response.data as CustomersInList[], lastRunSearch: currentDateTime.toUTCString() };
	}
);
