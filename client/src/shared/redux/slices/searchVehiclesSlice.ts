import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VehiclesInList } from "../../interfaces/vehicles/vehicleSearch";
import { fetchVehiclesThunk } from "../thunks/searchVehiclesThunks";

interface SearchVehiclesSliceState {
	vehicles: VehiclesInList[];
	isSearching: boolean;
	isError: boolean;
	error: string;
	lastRanSearch: string | null;
}

const initialStateData: SearchVehiclesSliceState = {
	vehicles: [],
	isSearching: false,
	isError: false,
	error: "",
	lastRanSearch: null,
};

export const searchVehiclesSlice = createSlice({
	name: "searchVehicles",
	initialState: initialStateData,
	reducers: {
		refreshLastVehicleSearchDate: (state, action: PayloadAction<string>) => {
			state.lastRanSearch = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchVehiclesThunk.pending, (state) => {
			state.isSearching = true;
			state.isError = false;
		});
		builder.addCase(fetchVehiclesThunk.fulfilled, (state, action) => {
			state.isSearching = false;
			state.isError = false;
			state.vehicles = action.payload.vehicles;
			state.lastRanSearch = action.payload.lastRunSearch;
		});
		builder.addCase(fetchVehiclesThunk.rejected, (state, action) => {
			if (action.error.message !== "Aborted") {
				state.isError = true;
				state.error = action.error.message as string;
			}
			state.isSearching = false;
		});
	},
});

export const { refreshLastVehicleSearchDate } = searchVehiclesSlice.actions;

export default searchVehiclesSlice;
