import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import appAxiosInstance from "../../../api/appAxiosInstance";
import { AgreementInList } from "../../../interfaces/agreements/agreementSearch";
import { XPagination } from "../../../interfaces/pagination/pagination";
import {
	setProcessError,
	setProcessLoading,
	setProcessSuccess,
	setSearchAgreementsData,
} from "../../slices/allProcessesSlice";
import { RootState } from "../../store";

export const fetchAgreementsThunk = createAsyncThunk(
	"allProcesses/fetchAgreements",
	async ({ limit, page }: { limit: number; page: number }, thunkApi) => {
		thunkApi.dispatch(setProcessLoading("searchAgreements"));

		const source = axios.CancelToken.source();
		thunkApi.signal.addEventListener("abort", () => source.cancel("cancelled"));

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
					Page: page,
					PageSize: limit,
				},
				cancelToken: source.token,
			});

			const pagination: XPagination = JSON.parse(response.headers["x-pagination"]);

			const currentDateTime = new Date();
			thunkApi.dispatch(setSearchAgreementsData({ agreements: response.data as AgreementInList[], pagination }));
			return thunkApi.dispatch(setProcessSuccess({ key: "searchAgreements", date: currentDateTime.toUTCString() }));
		} catch (error) {
			if (error) {
				const axiosErr = error as AxiosError;

				if (axiosErr.message === "cancelled") return false;

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
