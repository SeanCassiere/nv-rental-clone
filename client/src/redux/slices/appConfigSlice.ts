import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NavotarClientFeature } from "../../interfaces/authentication";
import { LOCAL_STORAGE_FUNCTIONS } from "../../utils/functions";

export type ThemeOptions = "light" | "dark";

interface AppConfigSliceState {
	theme: ThemeOptions;
	clientFeatures: NavotarClientFeature[];
}

const initialStateData: AppConfigSliceState = {
	theme: LOCAL_STORAGE_FUNCTIONS.getThemeFromLocalStorage(),
	clientFeatures: [],
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
		setClientFeatures: (state, action: PayloadAction<NavotarClientFeature[]>) => {
			state.clientFeatures = action.payload;
		},
	},
});

export const { switchTheme, setClientFeatures } = appConfigSlice.actions;

export default appConfigSlice.reducer;
