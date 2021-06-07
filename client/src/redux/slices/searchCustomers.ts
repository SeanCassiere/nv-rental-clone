import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CustomersInList } from "../../interfaces/customers";
import { fetchCustomersThunk } from "./thunks/searchCustomersThunks";

interface SearchCustomersSliceState {
	customers: CustomersInList[];
	isSearching: boolean;
	isError: boolean;
	error: string;
	lastRanSearch: string | null;
}

const initialStateData: SearchCustomersSliceState = {
	customers: [],
	isSearching: false,
	isError: false,
	error: "",
	lastRanSearch: null,
};

export const SearchCustomersSlice = createSlice({
	name: "searchCustomers",
	initialState: initialStateData,
	reducers: {
		refreshLastCustomersSearchDate: (state, action: PayloadAction<string>) => {
			state.lastRanSearch = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchCustomersThunk.pending, (state) => {
			state.isSearching = true;
			state.isError = false;
		});
		builder.addCase(fetchCustomersThunk.fulfilled, (state, action) => {
			state.isSearching = false;
			state.isError = false;
			state.customers = action.payload.customers;
			state.lastRanSearch = action.payload.lastRunSearch;
		});
		builder.addCase(fetchCustomersThunk.rejected, (state, action) => {
			if (action.error.message !== "Aborted") {
				state.isError = true;
				state.error = action.error.message as string;
			}
			state.isSearching = false;
		});
	},
});

export const { refreshLastCustomersSearchDate } = SearchCustomersSlice.actions;

export default SearchCustomersSlice.reducer;
