import { createAsyncThunk } from "@reduxjs/toolkit";
import appAxiosInstance from "../../api/appAxiosInstance";

import { RootState } from "../store";
import { NavotarClientFeature } from "../../interfaces/authentication";

export const fetchClientFeaturesThunk = createAsyncThunk(
	"appKeyValues/fetchReservationStatuses",
	async (_, thunkApi) => {
		const { authUser } = thunkApi.getState() as RootState;

		if (!authUser.isLoggedIn) return thunkApi.rejectWithValue("User is not logged in");

		try {
			const { data } = await appAxiosInstance.post<NavotarClientFeature[]>(
				`/Clients/${authUser.clientId}/ClientFeatures`,
				{},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${authUser.token}`,
					},
				}
			);

			return data;
		} catch (error) {
			return thunkApi.rejectWithValue("Fetch for client features failed");
		}
	}
);
