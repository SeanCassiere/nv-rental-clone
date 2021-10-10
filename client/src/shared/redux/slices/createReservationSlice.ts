import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AvailableLocation } from "../../interfaces/locations/location";
import { fakeActiveLocations } from "../../utils/fakeData2";
import { fetchCreateResLocationsThunk } from "../thunks/createReservationThunks";

interface SearchAgreementsSliceState {
	currentNavPosition: number;
	userForm: {
		checkoutLocationId: number | null;
		checkinLocationId: number | null;
		reservationTypeId: number | null;
		checkoutDate: string;
		checkinDate: string;
	};
	availableLocations: { locations: AvailableLocation[]; isSearching: boolean };
}

const initialCreateReservationStateData: SearchAgreementsSliceState = {
	currentNavPosition: 0,
	userForm: {
		checkoutLocationId: null,
		checkinLocationId: null,
		reservationTypeId: null,
		checkoutDate: "",
		checkinDate: "",
	},
	availableLocations: { locations: [], isSearching: true },
};

type NavPositions = "detail" | "customer" | "vehicle" | "misCharge";

export const createReservationSlice = createSlice({
	name: "createReservation",
	initialState: initialCreateReservationStateData,
	reducers: {
		clearCreateReservationState: (state) => {
			state.currentNavPosition = 0;
			state.userForm.checkoutLocationId = null;
			state.userForm.checkinLocationId = null;
			state.userForm.reservationTypeId = null;
			state.userForm.checkoutDate = "";
			state.userForm.checkinDate = "";
			state.availableLocations.locations = fakeActiveLocations;
			state.availableLocations.isSearching = false;
		},
		setJumpCreateResNavPosition: (state, action: PayloadAction<NavPositions>) => {
			if (action.payload === "detail") state.currentNavPosition = 0;
			if (action.payload === "customer") state.currentNavPosition = 1;
			if (action.payload === "vehicle") state.currentNavPosition = 2;
			if (action.payload === "misCharge") state.currentNavPosition = 3;
		},
		setCreateResCheckOutLocationId: (state, action: PayloadAction<number>) => {
			state.userForm.checkoutLocationId = action.payload;
		},
		setCreateResCheckInLocationId: (state, action: PayloadAction<number>) => {
			state.userForm.checkinLocationId = action.payload;
		},
		setCreateResCheckOutDate: (state, action: PayloadAction<string>) => {
			state.userForm.checkoutDate = action.payload;
		},
		setCreateResCheckInDate: (state, action: PayloadAction<string>) => {
			state.userForm.checkinDate = action.payload;
		},
		setCreateResTypeId: (state, action: PayloadAction<number>) => {
			state.userForm.reservationTypeId = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchCreateResLocationsThunk.pending, (state) => {
			state.availableLocations.isSearching = true;
		});
		builder.addCase(fetchCreateResLocationsThunk.fulfilled, (state, action) => {
			state.availableLocations.locations = action.payload;
			state.availableLocations.isSearching = false;
		});
	},
});

export const {
	clearCreateReservationState,
	setJumpCreateResNavPosition,
	setCreateResCheckOutLocationId,
	setCreateResCheckInLocationId,
	setCreateResTypeId,
	setCreateResCheckOutDate,
	setCreateResCheckInDate,
} = createReservationSlice.actions;

export default createReservationSlice;
