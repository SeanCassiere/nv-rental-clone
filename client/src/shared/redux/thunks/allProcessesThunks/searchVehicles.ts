import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import appAxiosInstance from "../../../api/appAxiosInstance";
import { XPagination } from "../../../interfaces/pagination/pagination";
import { VehiclesInList } from "../../../interfaces/vehicles/vehicleSearch";
import {
	setProcessError,
	setProcessLoading,
	setProcessSuccess,
	setSearchVehiclesData,
} from "../../slices/allProcessesSlice";
import { RootState } from "../../store";

export const fetchVehiclesThunk = createAsyncThunk(
	"allProcesses/fetchVehicles",
	async ({ limit, page }: { limit: number; page: number }, thunkApi) => {
		thunkApi.dispatch(setProcessLoading("searchVehicles"));

		const source = axios.CancelToken.source();
		thunkApi.signal.addEventListener("abort", () => source.cancel("cancelled"));

		const state = thunkApi.getState() as RootState;
		const authUser = state.authUser;

		try {
			const response = await appAxiosInstance.get(`/Vehicles`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authUser.token}`,
				},
				params: {
					ClientId: authUser.clientId,
					Page: page,
					PageSize: limit,
				},
				cancelToken: source.token,
			});

			const pagination: XPagination = JSON.parse(response.headers["x-pagination"]);

			const currentDateTime = new Date();
			thunkApi.dispatch(setSearchVehiclesData({ vehicles: response.data as VehiclesInList[], pagination }));
			return thunkApi.dispatch(setProcessSuccess({ key: "searchVehicles", date: currentDateTime.toUTCString() }));
		} catch (error) {
			if (error) {
				const axiosErr = error as AxiosError;

				if (axiosErr.message === "cancelled") return false;

				return thunkApi.dispatch(
					setProcessError({
						key: "searchVehicles",
						data: axiosErr.response?.data,
						msg: "Vehicles search failed",
					})
				);
			}
			return false;
		}
	}
);
