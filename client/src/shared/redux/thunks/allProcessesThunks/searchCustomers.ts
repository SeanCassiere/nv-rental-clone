import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import appAxiosInstance from "../../../api/appAxiosInstance";
import { CustomersInList } from "../../../interfaces/customers/customerSearch";
import { XPagination } from "../../../interfaces/pagination/pagination";
import {
	setProcessError,
	setProcessLoading,
	setProcessSuccess,
	setSearchCustomersData,
} from "../../slices/allProcessesSlice";
import { RootState } from "../../store";

export const fetchCustomersThunk = createAsyncThunk(
	"allProcesses/fetchCustomers",
	async ({ limit, page }: { limit: number; page: number }, thunkApi) => {
		thunkApi.dispatch(setProcessLoading("searchCustomers"));

		const source = axios.CancelToken.source();
		thunkApi.signal.addEventListener("abort", () => source.cancel("cancelled"));

		const state = thunkApi.getState() as RootState;
		const authUser = state.authUser;

		try {
			const response = await appAxiosInstance.get(`/Customers`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authUser.token}`,
				},
				params: {
					ClientId: authUser.clientId,
					UserId: authUser.userId,
					Page: page,
					PageSize: limit,
				},
				cancelToken: source.token,
			});

			const pagination: XPagination = JSON.parse(response.headers["x-pagination"]);

			const currentDateTime = new Date();
			thunkApi.dispatch(setSearchCustomersData({ customers: response.data as CustomersInList[], pagination }));
			return thunkApi.dispatch(setProcessSuccess({ key: "searchCustomers", date: currentDateTime.toUTCString() }));
		} catch (error) {
			if (error) {
				const axiosErr = error as AxiosError;

				if (axiosErr.message === "cancelled") return false;

				return thunkApi.dispatch(
					setProcessError({
						key: "searchCustomers",
						data: axiosErr.response?.data,
						msg: "Customers search failed",
					})
				);
			}
			return false;
		}
	}
);
