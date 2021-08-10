import { createAsyncThunk } from "@reduxjs/toolkit";
import appAxiosInstance from "../../api/appAxiosInstance";

import { Alert } from "rsuite";

import { RootState } from "../store";
import { VehicleStatus } from "../../interfaces/vehicles/vehicleStatus";
import { AgreementStatus } from "../../interfaces/agreements/agreementStatus";
import { ReservationStatus } from "../../interfaces/reservations/reservationStatus";
import { ReservationType } from "../../interfaces/reservations/reservationType";
import { AgreementType } from "../../interfaces/agreements/agreementType";
import { VehicleTypeShort } from "../../interfaces/vehicles/vehicleType";

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

export const fetchReservationTypesThunk = createAsyncThunk(
	"appKeyValues/fetchReservationTypes",
	async (_, thunkApi) => {
		const { authUser } = thunkApi.getState() as RootState;

		if (!authUser.isLoggedIn) return thunkApi.rejectWithValue("User is not logged in");

		try {
			const { data } = await appAxiosInstance.get<ReservationType[]>("/Reservations/Types", {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authUser.token}`,
				},
				params: {
					clientId: authUser.clientId,
				},
			});

			return data;
		} catch (error) {
			Alert.error("Fetching the reservation types failed");
			return thunkApi.rejectWithValue("Fetching the reservation types failed");
		}
	}
);

export const fetchReservationKeyValuesThunk = createAsyncThunk(
	"appKeyValues/fetchReservationKeyValues",
	async (_, thunkApi) => {
		await thunkApi.dispatch(fetchReservationStatusesThunk());
		await thunkApi.dispatch(fetchReservationTypesThunk());
		return true;
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

export const fetchAgreementTypesThunk = createAsyncThunk("appKeyValues/fetchAgreementTypes", async (_, thunkApi) => {
	const { authUser } = thunkApi.getState() as RootState;

	if (!authUser.isLoggedIn) return thunkApi.rejectWithValue("User is not logged in");

	try {
		const { data } = await appAxiosInstance.get<AgreementType[]>("/Agreements/Types", {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authUser.token}`,
			},
			params: {
				clientId: authUser.clientId,
			},
		});

		return data;
	} catch (error) {
		Alert.error("Fetching the agreement types failed");
		return thunkApi.rejectWithValue("Fetching the agreement types failed");
	}
});

export const fetchAgreementKeyValuesThunk = createAsyncThunk(
	"appKeyValues/fetchAgreementKeyValues",
	async (_, thunkApi) => {
		await thunkApi.dispatch(fetchAgreementStatusesThunk());
		await thunkApi.dispatch(fetchAgreementTypesThunk());
		return true;
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
			params: {
				clientId: authUser.clientId,
			},
		});

		return data;
	} catch (error) {
		Alert.error("Fetching the vehicle statuses failed");
		return thunkApi.rejectWithValue("Fetching the vehicle statuses failed");
	}
});

export const fetchVehicleTypesShortThunk = createAsyncThunk(
	"appKeyValues/fetchVehicleTypesShort",
	async (_, thunkApi) => {
		const { authUser } = thunkApi.getState() as RootState;

		if (!authUser.isLoggedIn) return thunkApi.rejectWithValue("User is not logged in");

		try {
			const { data } = await appAxiosInstance.get<VehicleTypeShort[]>("/Vehicles/Types", {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authUser.token}`,
				},
				params: {
					clientId: authUser.clientId,
				},
			});

			return data;
		} catch (error) {
			Alert.error("Fetching the vehicle types failed");
			return thunkApi.rejectWithValue("Fetching the vehicle types failed");
		}
	}
);

export const fetchVehicleKeyValuesThunk = createAsyncThunk(
	"appKeyValues/fetchVehicleKeyValues",
	async (_, thunkApi) => {
		await thunkApi.dispatch(fetchVehicleStatusesThunk());
		await thunkApi.dispatch(fetchVehicleTypesShortThunk());
		return true;
	}
);
