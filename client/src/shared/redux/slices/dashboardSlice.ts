import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IWidget } from "../../interfaces/dashboard/widgets";

interface AppConfigSliceState {
	widgets: IWidget[];
}

const initialStateData: AppConfigSliceState = {
	widgets: [],
};

export const dashboardSlice = createSlice({
	name: "dashboard",
	initialState: initialStateData,
	reducers: {
		setDashboardWidgets: (state, action: PayloadAction<IWidget[]>) => {
			state.widgets = action.payload;
		},
	},
	extraReducers: (builder) => {},
});

export const { setDashboardWidgets } = dashboardSlice.actions;

export default dashboardSlice;
