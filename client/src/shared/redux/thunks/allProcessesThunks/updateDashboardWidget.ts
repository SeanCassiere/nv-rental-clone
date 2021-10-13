import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError, AxiosResponse } from "axios";

import appAxiosInstance from "../../../api/appAxiosInstance";
import { IWidget } from "../../../interfaces/dashboard/widgets";
import { setProcessError, setProcessLoading, setProcessSuccess } from "../../slices/allProcessesSlice";
import { RootState } from "../../store";

export const updateDashboardWidgetThunk = createAsyncThunk(
	"allProcesses/updateDashboardWidget",
	async (widgetList: IWidget[], thunkApi) => {
		thunkApi.dispatch(setProcessLoading("updateDashboardWidget"));

		const state = thunkApi.getState() as RootState;
		const authUser = state.authUser;

		const promises: Promise<AxiosResponse<any>>[] = [];

		for (const widget of widgetList) {
			const updatePromise = appAxiosInstance.post("/Dashboard", widget, {
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${authUser.token}` },
			});
			promises.push(updatePromise);
		}

		try {
			await axios.all(promises);

			const currentDateTime = new Date();
			return thunkApi.dispatch(setProcessSuccess({ key: "fetchWidgetsList", date: currentDateTime.toUTCString() }));
		} catch (error) {
			if (error) {
				const axiosErr = error as AxiosError;

				return thunkApi.dispatch(
					setProcessError({
						key: "updateDashboardWidget",
						data: axiosErr.response?.data,
						msg: "Widgets update failed",
					})
				);
			}
			return false;
		}
	}
);
