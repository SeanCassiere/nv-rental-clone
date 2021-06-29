import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NavotarClientFeature } from "../../interfaces/clients/clientFeatures";

import { fetchClientFeaturesThunk } from "../thunks/appConfigThunks";
import { LOCAL_STORAGE_FUNCTIONS } from "../../utils/functions";

export type ThemeOptions = "light" | "dark";

interface AppConfigSliceState {
	theme: ThemeOptions;
	clientFeatures: NavotarClientFeature[];
	dates: {
		dateShort: string;
		dateLong: string;
		dateTimeLong: string;
	};
	error: string | null;
}

const initialStateData: AppConfigSliceState = {
	theme: LOCAL_STORAGE_FUNCTIONS.getThemeFromLocalStorage(),
	clientFeatures: [],
	dates: {
		dateShort: "MM/DD/YYYY",
		dateLong: "MM/DD/YYYY",
		dateTimeLong: "MM/DD/YYYY HH:mm a",
	},
	error: null,
};

export const appConfigSlice = createSlice({
	name: "appConfig",
	initialState: initialStateData,
	reducers: {
		switchTheme: (state, action: PayloadAction<ThemeOptions>) => {
			if (action.payload === "light") state.theme = "dark";
			if (action.payload === "dark") state.theme = "light";
			LOCAL_STORAGE_FUNCTIONS.setThemeToLocalStorage(state.theme);
		},
		setDateShort: (state, action: PayloadAction<string>) => {
			state.dates.dateShort = action.payload.toUpperCase();
		},
		setDateLong: (state, action: PayloadAction<string>) => {
			state.dates.dateLong = action.payload.toUpperCase();
		},
		setDateTimeLong: (state, action: PayloadAction<string>) => {
			state.dates.dateTimeLong = `${action.payload.toUpperCase()} HH:mm a`;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchClientFeaturesThunk.rejected, (state, action) => {
			state.error = action.error?.message as string;
		});
		builder.addCase(fetchClientFeaturesThunk.fulfilled, (state, action) => {
			state.clientFeatures = action.payload;
		});
	},
});

export const { switchTheme, setDateShort, setDateLong, setDateTimeLong } = appConfigSlice.actions;

export default appConfigSlice.reducer;
