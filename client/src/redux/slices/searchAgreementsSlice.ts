import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AgreementInList } from "../../interfaces/agreement";
import { fetchAgreementsThunk } from "../thunks/searchAgreementsThunks";

interface SearchAgreementsSliceState {
	agreements: AgreementInList[];
	isSearching: boolean;
	isError: boolean;
	error: string;
	lastRanSearch: string | null;
}

const initialStateData: SearchAgreementsSliceState = {
	agreements: [],
	isSearching: false,
	isError: false,
	error: "",
	lastRanSearch: null,
};

export const SearchAgreementsSlice = createSlice({
	name: "searchAgreements",
	initialState: initialStateData,
	reducers: {
		refreshLastSearchDate: (state, action: PayloadAction<string>) => {
			state.lastRanSearch = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchAgreementsThunk.pending, (state) => {
			state.isSearching = true;
			state.isError = false;
		});
		builder.addCase(fetchAgreementsThunk.fulfilled, (state, action) => {
			state.isSearching = false;
			state.isError = false;
			state.agreements = action.payload.agreements;
			state.lastRanSearch = action.payload.lastRunSearch;
		});
		builder.addCase(fetchAgreementsThunk.rejected, (state, action) => {
			if (action.error.message !== "Aborted") {
				state.isError = true;
				state.error = action.error.message as string;
			}
			state.isSearching = false;
		});
	},
});

export const { refreshLastSearchDate } = SearchAgreementsSlice.actions;

export default SearchAgreementsSlice.reducer;
