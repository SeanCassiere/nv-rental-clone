import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import appAxiosInstance from "../../../api/appAxiosInstance";
import { AgreementInList } from "../../../interfaces/agreements/agreementSearch";
import {
	setProcessError,
	setProcessLoading,
	setProcessSuccess,
	setSearchAgreementsData,
} from "../../slices/allProcessesSlice";
import { RootState } from "../../store";

export const fetchAgreementsThunk = createAsyncThunk(
	"allProcesses/fetchAgreements",
	async ({ limit }: { limit: number }, thunkApi) => {
		thunkApi.dispatch(setProcessLoading("searchAgreements"));

		const source = axios.CancelToken.source();
		thunkApi.signal.addEventListener("abort", () => source.cancel());

		const state = thunkApi.getState() as RootState;
		const authUser = state.authUser;

		try {
			const response = await appAxiosInstance.get(`/Agreements`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authUser.token}`,
				},
				params: {
					ClientId: authUser.clientId,
					UserId: authUser.userId,
					Page: 1,
					PageSize: limit,
				},
				cancelToken: source.token,
			});

			const currentDateTime = new Date();
			thunkApi.dispatch(setSearchAgreementsData(response.data as AgreementInList[]));
			return thunkApi.dispatch(setProcessSuccess({ key: "searchAgreements", date: currentDateTime.toUTCString() }));
		} catch (error) {
			if (error) {
				const axiosErr = error as AxiosError;
				return thunkApi.dispatch(
					setProcessError({
						key: "searchAgreements",
						data: axiosErr.response?.data,
						msg: "Agreement search failed",
					})
				);
			}
			return false;
		}
	}
);
