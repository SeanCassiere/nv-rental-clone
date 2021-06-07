import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LOCAL_STORAGE_FUNCTIONS } from "../../utils/functions";

export type ThemeOptions = "light" | "dark";

interface AppConfigSliceState {
	theme: ThemeOptions;
}

let initialStateData: AppConfigSliceState;
const callTheme = LOCAL_STORAGE_FUNCTIONS.getThemeFromLocalStorage();
initialStateData = {
	theme: callTheme,
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
});

export const { switchTheme } = appConfigSlice.actions;

export default appConfigSlice.reducer;
