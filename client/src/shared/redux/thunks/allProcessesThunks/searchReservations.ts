import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import appAxiosInstance from "../../../api/appAxiosInstance";
import { ReservationsInList } from "../../../interfaces/reservations/reservationSearch";
import {
	setProcessError,
	setProcessLoading,
	setProcessSuccess,
	setSearchReservationsData,
} from "../../slices/allProcessesSlice";
import { RootState } from "../../store";

export const fetchReservationsThunk = createAsyncThunk(
	"allProcesses/fetchReservations",
	async ({ limit }: { limit: number }, thunkApi) => {
		thunkApi.dispatch(setProcessLoading("searchReservations"));

		const source = axios.CancelToken.source();
		thunkApi.signal.addEventListener("abort", () => source.cancel("cancelled"));

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
			thunkApi.dispatch(setSearchReservationsData(response.data as ReservationsInList[]));
			return thunkApi.dispatch(setProcessSuccess({ key: "searchReservations", date: currentDateTime.toUTCString() }));
		} catch (error) {
			if (error) {
				const axiosErr = error as AxiosError;

				if (axiosErr.message === "cancelled") return false;

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
