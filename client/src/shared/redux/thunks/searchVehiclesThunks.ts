import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import appAxiosInstance from "../../api/appAxiosInstance";
import { VehiclesInList } from "../../interfaces/vehicles/vehicleSearch";
import { RootState } from "../store";

export const fetchVehiclesThunk = createAsyncThunk(
	"searchVehicles/fetchVehicles",
	async ({ limit }: { limit: number }, thunkApi) => {
		const source = axios.CancelToken.source();
		thunkApi.signal.addEventListener("abort", () => source.cancel());

		const state = thunkApi.getState() as RootState;
		const authUser = state.authUser;

		const response = await appAxiosInstance.get(`/Vehicles`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authUser.token}`,
			},
			params: {
				ClientId: authUser.clientId,
				Page: 1,
				PageSize: limit,
			},
			cancelToken: source.token,
		});

		if (response.status !== 200) return thunkApi.rejectWithValue(response.statusText);

		const currentDateTime = new Date();
		return { vehicles: response.data as VehiclesInList[], lastRunSearch: currentDateTime.toUTCString() };
	}
);
