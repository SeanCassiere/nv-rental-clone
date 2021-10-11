import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toaster, Message } from "rsuite";
import appAxios from "../../api/appAxiosInstance";

import { ReservationViewDataFull } from "../../interfaces/reservations/reservationView";
import { ReservationSummaryResponseFull } from "../../interfaces/reservations/reservationSummary";
import { RootState } from "../store";

export const fetchViewReservationByIdThunk = createAsyncThunk(
	"viewReservation/fetchReservationByIdThunk",
	async (id: string, thunkApi) => {
		const source = axios.CancelToken.source();
		thunkApi.signal.addEventListener("abort", () => source.cancel());

		const state = thunkApi.getState() as RootState;
		const authUser = state.authUser;

		if (authUser.token === null || authUser.clientId === null) {
			return thunkApi.rejectWithValue("User must be logged in");
		}

		// Fetch Reservation View GET /Reservations/:id
		const reservationView = await appAxios.get<ReservationViewDataFull>(`/Reservations/${id}`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authUser.token}`,
			},
			params: {
				ClientId: authUser.clientId,
			},
			cancelToken: source.token,
		});

		if (reservationView.status !== 200) return thunkApi.rejectWithValue(reservationView.statusText);

		//Fetch Reservation Summary GET /Reservations/:id/Summary
		const reservationSummary = await appAxios.get<ReservationSummaryResponseFull>(`/Reservations/${id}/Summary`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authUser.token}`,
			},
			params: {
				clientId: authUser.clientId,
			},
			cancelToken: source.token,
		});

		if (reservationSummary.status !== 200) return thunkApi.rejectWithValue(reservationSummary.statusText);

		// Return fetched payload
		return { reservationView: reservationView.data, reservationSummary: reservationSummary.data };
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
			toaster.push(<Message type='error'>Could not fetch the Print PDF URL</Message>);
			return thunkApi.rejectWithValue(response.statusText);
		}

		return response.data;
	}
);
