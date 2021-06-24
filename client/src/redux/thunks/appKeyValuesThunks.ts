import { createAsyncThunk } from "@reduxjs/toolkit";
import appAxiosInstance from "../../api/appAxiosInstance";

import { RootState } from "../store";
import { ReservationStatus } from "../../interfaces/statuses";

export const fetchReservationStatusesThunk = createAsyncThunk(
	"appKeyValues/fetchReservationStatuses",
	async (_, thunkApi) => {
		const { authUser } = thunkApi.getState() as RootState;

		if (!authUser.isLoggedIn) return thunkApi.rejectWithValue("User is not logged in");

		try {
			const { data } = await appAxiosInstance.get<ReservationStatus[]>("/Reservations/Statuses", {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authUser.token}`,
				},
			});

			return data;
		} catch (error) {
			return thunkApi.rejectWithValue("Fetch for reservation status failed");
		}
	}
);
