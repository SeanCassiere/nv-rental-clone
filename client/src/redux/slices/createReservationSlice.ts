import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchAgreementsSliceState {
	currentNavPosition: number;
}

const initialCreateReservationStateData: SearchAgreementsSliceState = {
	currentNavPosition: 0,
};

type NavPositions = "detail" | "customer" | "vehicle" | "misCharge";

export const CreateReservationSlice = createSlice({
	name: "createReservation",
	initialState: initialCreateReservationStateData,
	reducers: {
		clearCreateReservationState: (state) => {
			state.currentNavPosition = 0;
		},
		setJumpCreateResNavPosition: (state, action: PayloadAction<NavPositions>) => {
			if (action.payload === "detail") state.currentNavPosition = 0;
			if (action.payload === "customer") state.currentNavPosition = 1;
			if (action.payload === "vehicle") state.currentNavPosition = 2;
			if (action.payload === "misCharge") state.currentNavPosition = 3;
		},
	},
	extraReducers: (builder) => {},
});

export const { clearCreateReservationState, setJumpCreateResNavPosition } = CreateReservationSlice.actions;

export default CreateReservationSlice.reducer;
