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
import { IR_AvailableReport } from "../../interfaces/reports/availableReport";
import { IR_ReportFolder } from "../../interfaces/reports/folder";

export const fetchReservationStatusesThunk = createAsyncThunk(
	"lookupList/fetchReservationStatuses",
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

export const fetchReservationTypesThunk = createAsyncThunk("lookupList/fetchReservationTypes", async (_, thunkApi) => {
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
});

export const fetchReservationKeyValuesThunk = createAsyncThunk(
	"lookupList/fetchReservationKeyValues",
	async (_, thunkApi) => {
		await thunkApi.dispatch(fetchReservationStatusesThunk());
		await thunkApi.dispatch(fetchReservationTypesThunk());
		return true;
	}
);

export const fetchAgreementStatusesThunk = createAsyncThunk(
	"lookupList/fetchAgreementStatuses",
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

export const fetchAgreementTypesThunk = createAsyncThunk("lookupList/fetchAgreementTypes", async (_, thunkApi) => {
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
	"lookupList/fetchAgreementKeyValues",
	async (_, thunkApi) => {
		await thunkApi.dispatch(fetchAgreementStatusesThunk());
		await thunkApi.dispatch(fetchAgreementTypesThunk());
		return true;
	}
);

export const fetchVehicleStatusesThunk = createAsyncThunk("lookupList/fetchVehicleStatuses", async (_, thunkApi) => {
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
	"lookupList/fetchVehicleTypesShort",
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

export const fetchVehicleKeyValuesThunk = createAsyncThunk("lookupList/fetchVehicleKeyValues", async (_, thunkApi) => {
	await thunkApi.dispatch(fetchVehicleStatusesThunk());
	await thunkApi.dispatch(fetchVehicleTypesShortThunk());
	return true;
});

export const fetchAvailableReportFolders = createAsyncThunk(
	"lookupList/fetchAvailableReportFolders",
	async (_, thunkApi) => {
		const { authUser } = thunkApi.getState() as RootState;

		if (!authUser.isLoggedIn) return thunkApi.rejectWithValue("User is not logged in");

		try {
			const { data } = await appAxiosInstance.get<IR_ReportFolder[]>("/Reports/Folders", {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authUser.token}`,
				},
				params: {
					clientId: authUser.clientId,
					userId: authUser.userId,
				},
			});

			return data;
		} catch (error) {
			Alert.error("Fetching the report folders failed");
			return thunkApi.rejectWithValue("Fetching the report folders failed");
		}
	}
);

export const fetchAvailableReports = createAsyncThunk("lookupList/fetchAvailableReports", async (_, thunkApi) => {
	const { authUser } = thunkApi.getState() as RootState;

	if (!authUser.isLoggedIn) return thunkApi.rejectWithValue("User is not logged in");

	try {
		const { data } = await appAxiosInstance.get<IR_AvailableReport[]>("/Reports", {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authUser.token}`,
			},
			params: {
				clientId: authUser.clientId,
				userId: authUser.userId,
			},
		});

		return data;
	} catch (error) {
		Alert.error("Fetching the reports failed");
		return thunkApi.rejectWithValue("Fetching the reports failed");
	}
});
