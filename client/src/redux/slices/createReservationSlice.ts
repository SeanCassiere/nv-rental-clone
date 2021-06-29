import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchAgreementsSliceState {
	currentNavPosition: number;
}

const initialCreateReservationStateData: SearchAgreementsSliceState = {
	currentNavPosition: 0,
};

export const CreateReservationSlice = createSlice({
	name: "createReservation",
	initialState: initialCreateReservationStateData,
	reducers: {
		clearCreateReservationState: (state) => {
			state.currentNavPosition = 0;
		},
		setCreateResNavPosition: (state, action: PayloadAction<number>) => {
			state.currentNavPosition = action.payload;
		},
	},
	extraReducers: (builder) => {},
});

export const { clearCreateReservationState, setCreateResNavPosition } = CreateReservationSlice.actions;

export default CreateReservationSlice.reducer;
