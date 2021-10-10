import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Table, Panel, Message } from "rsuite";
import Moment from "react-moment";

import { useSelector, useDispatch } from "react-redux";
import {
	AppDispatch,
	selectAppConfigState,
	selectAppKeyValuesState,
	selectAuthUserState,
	selectSearchAgreementsState,
} from "../../shared/redux/store";
import { fetchAgreementsThunk } from "../../shared/redux/thunks/allProcessesThunks/searchAgreeements";
import { setLastRanDate } from "../../shared/redux/slices/allProcessesSlice";

import AppPageContainer from "../../shared/components/AppPageContainer";
import ViewPageHeader from "../../shared/components/ViewPageHeader";

import { AgreementInList } from "../../shared/interfaces/agreements/agreementSearch";

const { Column, HeaderCell, Cell } = Table;

const AgreementSearchPage: React.FunctionComponent = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { token, clientId, userId } = useSelector(selectAuthUserState);
	const {
		agreementValues: { agreementStatuses },
	} = useSelector(selectAppKeyValuesState);
	const { dates } = useSelector(selectAppConfigState);
	const { data, isProcessing, lastRun, isError, errorMsg: searchError } = useSelector(selectSearchAgreementsState);

	React.useEffect(() => {
		const currentTime = Math.floor(Date.now());
		const lastSearch = lastRun ? Math.floor(Date.parse(lastRun) + 30000) : Math.floor(Date.now());

		// Skip searching if already search in the last 30 secs
		if (lastSearch > currentTime) return;

		if (!clientId || !userId) return;

		const promise = dispatch(fetchAgreementsThunk({ limit: 15 }));

		return () => promise.abort();
	}, [dispatch, lastRun, token, clientId, userId]);

	const handleRefreshList = React.useCallback(() => {
		const currentTime = new Date();
		currentTime.setDate(currentTime.getDate() - 120);
		dispatch(setLastRanDate({ date: currentTime.toUTCString(), key: "searchAgreements" }));
	}, [dispatch]);

	return (
		<AppPageContainer>
			<Panel
				header={<ViewPageHeader title='Search Agreements' refreshFunction={handleRefreshList} refresh />}
				bordered
				style={{ marginBottom: 10 }}
				defaultExpanded
			>
				Agreement Search page
			</Panel>
			{isError && (
				<Message type='error' title='An error occurred' description={searchError} style={{ marginBottom: 10 }} />
			)}
			<Table height={500} bordered data={data} loading={isProcessing} shouldUpdateScroll={false}>
				<Column width={110}>
					<HeaderCell>Agreement No.</HeaderCell>
					<Cell dataKey='AgreementNumber' />
				</Column>

				<Column width={100}>
					<HeaderCell>Vehicle No.</HeaderCell>
					<Cell dataKey='VehicleNo' />
				</Column>

				<Column width={100}>
					<HeaderCell>License No.</HeaderCell>
					<Cell dataKey='LicenseNo' />
				</Column>

				<Column width={120}>
					<HeaderCell>Check-Out Date</HeaderCell>
					<Cell>
						{(rowData: AgreementInList) => {
							return <Moment format={dates.dateShort}>{rowData.CheckoutDate}</Moment>;
						}}
					</Cell>
				</Column>

				<Column width={120}>
					<HeaderCell>Check-In Date</HeaderCell>
					<Cell>
						{(rowData: AgreementInList) => {
							return <Moment format={dates.dateShort}>{rowData.CheckinDate}</Moment>;
						}}
					</Cell>
				</Column>

				<Column width={200}>
					<HeaderCell>Customer Name</HeaderCell>
					<Cell>
						{(rowData: AgreementInList) => {
							return <>{rowData.FirstName + " " + rowData.LastName}</>;
						}}
					</Cell>
				</Column>

				<Column width={150}>
					<HeaderCell>Status</HeaderCell>
					<Cell>
						{(rowData: AgreementInList) => {
							const rowStatus = agreementStatuses.filter((stat) => stat.id === rowData.AgreementStatusId);
							if (rowStatus[0]?.name === "Close") return <span style={{ color: "#D75252" }}>Closed</span>;
							if (rowStatus[0]?.name === "PendingPayment")
								return <span style={{ color: "#9119A4" }}>Pending Payments</span>;
							if (rowStatus[0]?.name === "Open") return <span style={{ color: "#069F2E" }}>Open</span>;
							return <>{rowStatus[0]?.name}</>;
						}}
					</Cell>
				</Column>

				<Column width={120}>
					<HeaderCell>Created Date</HeaderCell>
					<Cell>
						{(rowData: AgreementInList) => {
							return <Moment format={dates.dateShort}>{rowData.CreatedDate}</Moment>;
						}}
					</Cell>
				</Column>

				<Column width={180}>
					<HeaderCell>Created By</HeaderCell>
					<Cell dataKey='CreatedByName' />
				</Column>

				<Column minWidth={150} flexGrow={1} fixed='right'>
					<HeaderCell>Action</HeaderCell>

					<Cell>
						{(rowData: AgreementInList) => {
							const status = rowData.AgreementStatusName;
							return (
								<span>
									<RouterLink to={`/agreements/${rowData.AgreementId}`}>View</RouterLink>
									&nbsp;|&nbsp;
									<RouterLink to={`/agreements/${rowData.AgreementId}/edit`}>Edit</RouterLink>
									{status === "Open" && (
										<>
											&nbsp;|&nbsp;
											<RouterLink to={`/agreements/${rowData.AgreementId}/checkin`}>Check In</RouterLink>
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

export default AgreementSearchPage;
