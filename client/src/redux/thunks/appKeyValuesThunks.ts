import { createAsyncThunk } from "@reduxjs/toolkit";
import appAxiosInstance from "../../api/appAxiosInstance";

import { Alert } from "rsuite";

import { RootState } from "../store";
import { ReservationStatus, AgreementStatus, VehicleStatus } from "../../interfaces/statuses";

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
			Alert.error("Fetching the reservation statuses failed");
			return thunkApi.rejectWithValue("Fetching the reservation statuses failed");
		}
	}
);

export const fetchAgreementStatusesThunk = createAsyncThunk(
	"appKeyValues/fetchAgreementStatuses",
	async (_, thunkApi) => {
		const { authUser } = thunkApi.getState() as RootState;

		if (!authUser.isLoggedIn) return thunkApi.rejectWithValue("User is not logged in");

		try {
			const { data } = await appAxiosInstance.get<AgreementStatus[]>("/Agreements/Statuses", {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authUser.token}`,
				},
			});

			return data;
		} catch (error) {
			Alert.error("Fetching the agreement statuses failed");
			return thunkApi.rejectWithValue("Fetching the agreement statuses failed");
		}
	}
);

export const fetchVehicleStatusesThunk = createAsyncThunk("appKeyValues/fetchVehicleStatuses", async (_, thunkApi) => {
	const { authUser } = thunkApi.getState() as RootState;

	if (!authUser.isLoggedIn) return thunkApi.rejectWithValue("User is not logged in");

	try {
		const { data } = await appAxiosInstance.get<VehicleStatus[]>("/Vehicles/Statuses", {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authUser.token}`,
			},
		});

		return data;
	} catch (error) {
		Alert.error("Fetching the vehicle statuses failed");
		return thunkApi.rejectWithValue("Fetching the vehicle statuses failed");
	}
});
