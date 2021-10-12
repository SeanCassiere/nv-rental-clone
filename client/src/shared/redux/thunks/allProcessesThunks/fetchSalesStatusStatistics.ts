import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import appAxiosInstance from "../../../api/appAxiosInstance";
import { ISalesStatus } from "../../../interfaces/dashboard/salesStatus";
import { setProcessError, setProcessLoading, setProcessSuccess } from "../../slices/allProcessesSlice";
import { setSalesStatusData } from "../../slices/dashboardSlice";
import { RootState } from "../../store";

export const fetchSalesStatuses = createAsyncThunk("allProcesses/fetchSalesStatuses", async (_, thunkApi) => {
	thunkApi.dispatch(setProcessLoading("fetchSalesStatusStatistics"));

	const source = axios.CancelToken.source();
	thunkApi.signal.addEventListener("abort", () => source.cancel("cancelled"));

	const state = thunkApi.getState() as RootState;
	const authUser = state.authUser;

	const currentDateTime = new Date();

	try {
		const response = await appAxiosInstance.get(`/Statistics/Sales`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authUser.token}`,
			},
			params: {
				ClientId: authUser.clientId,
				UserId: authUser.userId,
				ClientDate: currentDateTime.toISOString(),
			},
			cancelToken: source.token,
		});

		thunkApi.dispatch(setSalesStatusData(response.data as ISalesStatus[]));
		return thunkApi.dispatch(
			setProcessSuccess({ key: "fetchSalesStatusStatistics", date: currentDateTime.toUTCString() })
		);
	} catch (error) {
		if (error) {
			const axiosErr = error as AxiosError;

			if (axiosErr.message === "cancelled") return false;

			return thunkApi.dispatch(
				setProcessError({
					key: "fetchSalesStatusStatistics",
					data: axiosErr.response?.data,
					msg: "Sales Status Statistics fetch failed",
				})
			);
		}
		return false;
	}
});
