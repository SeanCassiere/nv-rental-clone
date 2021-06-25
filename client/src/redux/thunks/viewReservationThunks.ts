import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Alert } from "rsuite";
import appAxios from "../../api/appAxiosInstance";
import { ReservationViewDataFull } from "../../interfaces/reservations";
import { RootState } from "../store";

export const fetchReservationThunk = createAsyncThunk(
	"viewReservation/fetchReservation",
	async (id: string, thunkApi) => {
		const source = axios.CancelToken.source();
		thunkApi.signal.addEventListener("abort", () => source.cancel());

		const state = thunkApi.getState() as RootState;
		const authUser = state.authUser;

		const response = await appAxios.get<ReservationViewDataFull>(`/Reservations/${id}`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authUser.token}`,
			},
			params: {
				ClientId: authUser.clientId,
			},
			cancelToken: source.token,
		});

		if (response.status !== 200) return thunkApi.rejectWithValue(response.statusText);

		return response.data;
	}
);

export const fetchReservationPDFThunk = createAsyncThunk(
	"viewReservation/fetchReservationPDF",
	async (id: string, thunkApi) => {
		const source = axios.CancelToken.source();
		thunkApi.signal.addEventListener("abort", () => source.cancel());

		const state = thunkApi.getState() as RootState;
		const authUser = state.authUser;

		const response = await appAxios.get<string>(`/Reservations/${id}/Print`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authUser.token}`,
			},
			params: {
				ClientId: authUser.clientId,
			},
			cancelToken: source.token,
		});

		if (response.status !== 200) {
			Alert.error("Could not fetch the Print PDF URL", 8000);
			return thunkApi.rejectWithValue(response.statusText);
		}

		return response.data;
	}
);
