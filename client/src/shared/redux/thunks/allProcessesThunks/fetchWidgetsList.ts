import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import appAxiosInstance from "../../../api/appAxiosInstance";
import { IWidget } from "../../../interfaces/dashboard/widgets";
import { sortAscendingList } from "../../../utils/sortsWidgetsOrder";
import { setProcessError, setProcessLoading, setProcessSuccess } from "../../slices/allProcessesSlice";
import { setDashboardWidgets } from "../../slices/dashboardSlice";
import { RootState } from "../../store";

export const fetchWidgetsList = createAsyncThunk("allProcesses/fetchWidgetsList", async (_, thunkApi) => {
	thunkApi.dispatch(setProcessLoading("fetchWidgetsList"));

	const source = axios.CancelToken.source();
	thunkApi.signal.addEventListener("abort", () => source.cancel("cancelled"));

	const state = thunkApi.getState() as RootState;
	const authUser = state.authUser;

	try {
		const response = await appAxiosInstance.get(`/Dashboard`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authUser.token}`,
			},
			params: {
				clientId: authUser.clientId,
				userId: authUser.userId,
			},
			cancelToken: source.token,
		});

		const currentDateTime = new Date();
		const rawData = response.data as IWidget[];
		const sorted = sortAscendingList(rawData);
		thunkApi.dispatch(setDashboardWidgets(sorted));
		return thunkApi.dispatch(setProcessSuccess({ key: "fetchWidgetsList", date: currentDateTime.toUTCString() }));
	} catch (error) {
		if (error) {
			const axiosErr = error as AxiosError;

			if (axiosErr.message === "cancelled") return false;

			return thunkApi.dispatch(
				setProcessError({
					key: "fetchWidgetsList",
					data: axiosErr.response?.data,
					msg: "Widgets fetch failed",
				})
			);
		}
		return false;
	}
});

export const updateWidgetAThunk = createAsyncThunk(
	"allProcesses/fetchWidgetsList/updateWidgetA",
	async (updateWidgetA: IWidget, thunkApi) => {
		// const source = axios.CancelToken.source();
		// thunkApi.signal.addEventListener("abort", () => source.cancel("cancelled"));

		const state = thunkApi.getState() as RootState;
		const authUser = state.authUser;

		try {
			await appAxiosInstance.post(`/dashboard`, updateWidgetA, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authUser.token}`,
				},
				// cancelToken: source.token,
			});
			return true;
		} catch (error) {
			console.log("FAILED allProcesses/fetchWidgetsList/updateWidgetA", error);
			return false;
		}
	}
);

export const updateWidgetBThunk = createAsyncThunk(
	"allProcesses/fetchWidgetsList/updateWidgetB",
	async (updateWidgetB: IWidget, thunkApi) => {
		// const source = axios.CancelToken.source();
		// thunkApi.signal.addEventListener("abort", () => source.cancel("cancelled"));

		const state = thunkApi.getState() as RootState;
		const authUser = state.authUser;

		try {
			await appAxiosInstance.post(`/dashboard`, updateWidgetB, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authUser.token}`,
				},
				// cancelToken: source.token,
			});
			return true;
		} catch (error) {
			console.log("FAILED allProcesses/fetchWidgetsList/updateWidgetB", error);
			return false;
		}
	}
);
