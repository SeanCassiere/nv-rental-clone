import { createAsyncThunk } from "@reduxjs/toolkit";
import appAxiosInstance from "../../api/appAxiosInstance";

import { RootState } from "../store";
import { NavotarClientFeature } from "../../interfaces/authentication";
import { setDateShort, setDateLong, setDateTimeLong } from "../slices/appConfigSlice";

export const fetchClientFeaturesThunk = createAsyncThunk("appKeyValues/fetchClientFeatures", async (_, thunkApi) => {
	const { authUser } = thunkApi.getState() as RootState;

	let returnData: NavotarClientFeature[];

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

		returnData = data;
	} catch (error) {
		return thunkApi.rejectWithValue("Fetch for client features failed");
	}

	const shortDate = returnData.filter((feat) => feat.featureId === 38)[0];
	if (shortDate?.value) thunkApi.dispatch(setDateShort(shortDate?.value));

	const longDate = returnData.filter((feat) => feat.featureId === 39)[0];
	if (longDate?.value) thunkApi.dispatch(setDateLong(longDate?.value));

	const longDateTime = returnData.filter((feat) => feat.featureId === 38)[0];
	if (longDateTime?.value) thunkApi.dispatch(setDateTimeLong(longDateTime?.value));

	return returnData;
});
