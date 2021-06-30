import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import appAxiosInstance from "../../api/appAxiosInstance";
import { AvailableLocation } from "../../interfaces/locations/location";
import { fakeActiveLocations } from "../../utils/fakeData2";
// import { RootState } from "../store";

export const fetchCreateResLocationsThunk = createAsyncThunk(
	"createReservation/fetchLocations",
	async (_, thunkApi) => {
		// const source = axios.CancelToken.source();
		// thunkApi.signal.addEventListener("abort", () => source.cancel());

		// const state = thunkApi.getState() as RootState;
		// const authUser = state.authUser;
		const i = await new Promise<AvailableLocation[]>((resolve, reject) => {
			setTimeout(() => {
				resolve(fakeActiveLocations);
			}, 2000);
		});

		return i;
	}
);
