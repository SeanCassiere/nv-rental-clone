import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import appAxiosInstance from "../../../api/appAxiosInstance";
import { VehiclesInList } from "../../../interfaces/vehicles/vehicleSearch";
import {
	setProcessError,
	setProcessLoading,
	setProcessSuccess,
	setSearchVehiclesData,
} from "../../slices/allProcessesSlice";
import { RootState } from "../../store";

export const fetchReservationsThunk = createAsyncThunk(
	"allProcesses/fetchReservations",
	async ({ limit }: { limit: number }, thunkApi) => {
		thunkApi.dispatch(setProcessLoading("searchReservations"));

		const source = axios.CancelToken.source();
		thunkApi.signal.addEventListener("abort", () => source.cancel());

		const state = thunkApi.getState() as RootState;
		const authUser = state.authUser;

		try {
			const response = await appAxiosInstance.get(`/Reservations`, {
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

			const currentDateTime = new Date();
			thunkApi.dispatch(setSearchVehiclesData(response.data as VehiclesInList[]));
			return thunkApi.dispatch(setProcessSuccess({ key: "searchReservations", date: currentDateTime.toUTCString() }));
		} catch (error) {
			if (error) {
				const axiosErr = error as AxiosError;
				return thunkApi.dispatch(
					setProcessError({
						key: "searchReservations",
						data: axiosErr.response?.data,
						msg: "Reservations search failed",
					})
				);
			}
			return false;
		}
	}
);
