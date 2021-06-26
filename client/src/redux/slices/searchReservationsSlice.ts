import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReservationsInList } from "../../interfaces/reservations/reservationSearch";
import { fetchReservationsThunk } from "../thunks/searchReservationsThunks";

interface SearchReservationsSliceState {
	reservations: ReservationsInList[];
	isSearching: boolean;
	isError: boolean;
	error: string;
	lastRanSearch: string | null;
}

const initialStateData: SearchReservationsSliceState = {
	reservations: [],
	isSearching: false,
	isError: false,
	error: "",
	lastRanSearch: null,
};

export const SearchReservationsSlice = createSlice({
	name: "searchReservations",
	initialState: initialStateData,
	reducers: {
		refreshLastReservationSearchDate: (state, action: PayloadAction<string>) => {
			state.lastRanSearch = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchReservationsThunk.pending, (state) => {
			state.isSearching = true;
			state.isError = false;
		});
		builder.addCase(fetchReservationsThunk.fulfilled, (state, action) => {
			state.isSearching = false;
			state.isError = false;
			state.reservations = action.payload.reservations;
			state.lastRanSearch = action.payload.lastRunSearch;
		});
		builder.addCase(fetchReservationsThunk.rejected, (state, action) => {
			if (action.error.message !== "Aborted") {
				state.isError = true;
				state.error = action.error.message as string;
			}
			state.isSearching = false;
		});
	},
});

export const { refreshLastReservationSearchDate } = SearchReservationsSlice.actions;

export default SearchReservationsSlice.reducer;
