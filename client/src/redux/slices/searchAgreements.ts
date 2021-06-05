import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AgreementInList } from "../../interfaces/agreement";

interface SearchAgreementsSliceState {
	agreements: AgreementInList[];
	isSearching: boolean;
	isError: boolean;
	error: string;
	lastRanSearch: string | null;
	redoSearch: boolean;
}

const initialStateData: SearchAgreementsSliceState = {
	agreements: [],
	isSearching: false,
	isError: false,
	error: "",
	lastRanSearch: null,
	redoSearch: false,
};

export const SearchAgreementsSlice = createSlice({
	name: "searchAgreements",
	initialState: initialStateData,
	reducers: {
		searchingAgreements: (state) => {
			state.isSearching = true;
			state.isError = false;
			state.redoSearch = false;
		},
		foundAgreements: (state, action: PayloadAction<{ agreements: AgreementInList[]; lastRanSearch: string }>) => {
			state.isSearching = false;
			state.isError = false;
			state.agreements = action.payload.agreements;
			state.lastRanSearch = action.payload.lastRanSearch;
			state.redoSearch = false;
		},
		errorAgreements: (state, action: PayloadAction<string>) => {
			state.agreements = [];
			state.isSearching = false;
			state.isError = true;
			state.error = action.payload;
			state.redoSearch = false;
		},
		refreshLastSearchDate: (state) => {
			state.redoSearch = true;
		},
	},
});

export const { searchingAgreements, foundAgreements, errorAgreements, refreshLastSearchDate } =
	SearchAgreementsSlice.actions;

export default SearchAgreementsSlice.reducer;
