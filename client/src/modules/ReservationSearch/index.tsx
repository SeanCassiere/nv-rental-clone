import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Table, Panel, Message, Icon } from "rsuite";
import Moment from "react-moment";

import { useSelector, useDispatch } from "react-redux";
import {
	AppDispatch,
	selectAppConfigState,
	selectAppKeyValuesState,
	selectAuthUserState,
	selectSearchReservationsState,
} from "../../shared/redux/store";
import { fetchReservationsThunk } from "../../shared/redux/thunks/allProcessesThunks/searchReservations";

import AppPageContainer from "../../shared/components/AppPageContainer";
import ViewPageHeader from "../../shared/components/ViewPageHeader";

import { ReservationsInList } from "../../shared/interfaces/reservations/reservationSearch";
import { setLastRanDate } from "../../shared/redux/slices/allProcessesSlice";

const { Column, HeaderCell, Cell } = Table;

const ReservationSearchPage: React.FunctionComponent = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { token, clientId, userId } = useSelector(selectAuthUserState);
	const { dates } = useSelector(selectAppConfigState);
	const { data, isProcessing, lastRun, isError, errorMsg: searchError } = useSelector(selectSearchReservationsState);
	const {
		reservationValues: { reservationStatuses },
	} = useSelector(selectAppKeyValuesState);

	React.useEffect(() => {
		const currentTime = Math.floor(Date.now());
		const lastSearch = lastRun ? Math.floor(Date.parse(lastRun) + 30000) : Math.floor(Date.now());

		// Skip searching if already search in the last 30 secs
		if (lastSearch > currentTime) return;

		if (!clientId || !userId) return;

		const promise = dispatch(fetchReservationsThunk({ limit: 15 }));

		return () => promise.abort();
	}, [dispatch, lastRun, token, clientId, userId]);

	const handleRefreshList = React.useCallback(() => {
		const currentTime = new Date();
		currentTime.setDate(currentTime.getDate() - 120);
		dispatch(setLastRanDate({ date: currentTime.toUTCString(), key: "searchReservations" }));
	}, [dispatch]);

	return (
		<AppPageContainer>
			<Panel
				header={<ViewPageHeader title='Search Reservations' refreshFunction={handleRefreshList} refresh />}
				bordered
				style={{ marginBottom: 10 }}
				defaultExpanded
			>
				Reservations Search page
				<br />
				<RouterLink to='/reservations/create'>Create Demo</RouterLink>
			</Panel>
			{isError && (
				<Message type='error' title='An error occurred' description={searchError} style={{ marginBottom: 10 }} />
			)}
			<Table height={500} bordered data={data} loading={isProcessing} shouldUpdateScroll={false}>
				<Column width={110}>
					<HeaderCell>Reservation No.</HeaderCell>
					<Cell dataKey='ReservationNumber' />
				</Column>

				<Column width={100}>
					<HeaderCell>Vehicle No.</HeaderCell>
					<Cell dataKey='VehicleNo' />
				</Column>

				<Column width={100}>
					<HeaderCell>License No.</HeaderCell>
					<Cell dataKey='LicenseNo' />
				</Column>

				<Column width={200}>
					<HeaderCell>Customer Name</HeaderCell>
					<Cell>
						{(rowData: ReservationsInList) => {
							return <>{rowData.FirstName + " " + rowData.LastName}</>;
						}}
					</Cell>
				</Column>

				<Column width={120}>
					<HeaderCell>Check-Out Date</HeaderCell>
					<Cell>
						{(rowData: ReservationsInList) => {
							const date = new Date(rowData.StartDate);
							return <>{date.toLocaleDateString()}</>;
						}}
					</Cell>
				</Column>

				<Column width={120}>
					<HeaderCell>Check-In Date</HeaderCell>
					<Cell>
						{(rowData: ReservationsInList) => {
							const date = new Date(rowData.EndDate);
							return <>{date.toLocaleDateString()}</>;
						}}
					</Cell>
				</Column>

				<Column width={200}>
					<HeaderCell>Location Name</HeaderCell>
					<Cell dataKey='StartLocationName' />
				</Column>

				<Column width={120}>
					<HeaderCell>Created Date</HeaderCell>
					<Cell>
						{(rowData: ReservationsInList) => {
							return <Moment format={dates.dateShort}>{rowData.CreatedDate}</Moment>;
						}}
					</Cell>
				</Column>

				<Column width={160}>
					<HeaderCell>Status</HeaderCell>
					<Cell>
						{(rowData: ReservationsInList) => {
							const rowStatId = rowData.StatusId;
							const rowStatus = reservationStatuses.filter((rdxStat) => rdxStat.id === rowStatId);
							return <>{rowStatus[0]?.name}</>;
						}}
					</Cell>
				</Column>

				<Column width={100}>
					<HeaderCell>Type</HeaderCell>
					<Cell dataKey='ReservationType' />
				</Column>

				<Column minWidth={150} flexGrow={1} fixed='right'>
					<HeaderCell>Action</HeaderCell>

					<Cell>
						{(rowData: ReservationsInList) => {
							const status = rowData.AgreementId;
							return (
								<span>
									<RouterLink to={`/reservations/${rowData.ReserveId}`}>View</RouterLink>
									&nbsp;|&nbsp;
									<RouterLink to={`/reservations/${rowData.ReserveId}/edit`}>Edit</RouterLink>
									{status && (
										<>
											&nbsp;|&nbsp;
											<RouterLink to={`/agreements/${rowData.AgreementId}`}>
												<Icon icon='arrow-circle-o-right' />
												&nbsp;Agreement
											</RouterLink>
										</>
									)}
								</span>
							);
						}}
					</Cell>
				</Column>
			</Table>
		</AppPageContainer>
	);
};

export default ReservationSearchPage;
