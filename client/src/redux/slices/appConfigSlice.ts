import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NavotarClientFeature } from "../../interfaces/authentication";

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
}

const initialStateData: AppConfigSliceState = {
	theme: LOCAL_STORAGE_FUNCTIONS.getThemeFromLocalStorage(),
	clientFeatures: [],
	dates: {
		dateShort: "MM/dd/yy",
		dateLong: "MM/dd/yy",
		dateTimeLong: "MM/dd/yy",
	},
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
	},
	extraReducers: (builder) => {
		builder.addCase(fetchClientFeaturesThunk.fulfilled, (state, action) => {
			state.clientFeatures = action.payload;
		});
	},
});

export const { switchTheme } = appConfigSlice.actions;

export default appConfigSlice.reducer;
