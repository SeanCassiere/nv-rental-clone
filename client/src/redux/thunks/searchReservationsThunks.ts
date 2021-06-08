import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import appAxiosInstance from "../../api/appAxiosInstance";
import { ReservationsInList } from "../../interfaces/reservations";
import { RootState } from "../store";

export const fetchReservationsThunk = createAsyncThunk(
	"searchReservations/fetchReservations",
	async ({ limit }: { limit: number }, thunkApi) => {
		const source = axios.CancelToken.source();
		thunkApi.signal.addEventListener("abort", () => source.cancel());

		const state = thunkApi.getState() as RootState;
		const authUser = state.authUser;

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

		if (response.status !== 200) return thunkApi.rejectWithValue(response.statusText);

		const currentDateTime = new Date();
		return { reservations: response.data as ReservationsInList[], lastRunSearch: currentDateTime.toUTCString() };
	}
);
