import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ISalesStatus } from "../../interfaces/dashboard/salesStatus";
import { IWidget } from "../../interfaces/dashboard/widgets";

interface AppConfigSliceState {
	widgets: IWidget[];
	salesStatusData: ISalesStatus[];
}

const initialStateData: AppConfigSliceState = {
	widgets: [],
	salesStatusData: [],
};

export const dashboardSlice = createSlice({
	name: "dashboard",
	initialState: initialStateData,
	reducers: {
		setDashboardWidgets: (state, action: PayloadAction<IWidget[]>) => {
			state.widgets = action.payload;
		},
		setSalesStatusData: (state, action: PayloadAction<ISalesStatus[]>) => {
			state.salesStatusData = action.payload;
		},
	},
	extraReducers: (builder) => {},
});

export const { setDashboardWidgets, setSalesStatusData } = dashboardSlice.actions;

export default dashboardSlice;
