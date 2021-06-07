import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Table, Panel, Message } from "rsuite";

import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, selectAuthUserState, selectSearchAgreementsState } from "../../redux/store";
import { fetchAgreementsThunk } from "../../redux/slices/thunks/searchAgreementsThunks";
import { refreshLastSearchDate } from "../../redux/slices/searchAgreements";

import AppPageContainer from "../../components/AppPageContainer";
import ViewPageHeader from "../../components/ViewPageHeader";

import { AgreementInList } from "../../interfaces/agreement";

const { Column, HeaderCell, Cell } = Table;

const AgreementSearchPage: React.FunctionComponent = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { token, clientId, userId } = useSelector(selectAuthUserState);
	const {
		agreements: data,
		isSearching,
		lastRanSearch,
		isError,
		error: searchError,
	} = useSelector(selectSearchAgreementsState);

	React.useEffect(() => {
		const currentTime = Math.floor(Date.now());
		const lastSearch = lastRanSearch ? Math.floor(Date.parse(lastRanSearch) + 30000) : Math.floor(Date.now());

		// Skip searching if already search in the last 30 secs
		if (lastSearch > currentTime) return;

		if (!clientId || !userId) return;

		const promise = dispatch(fetchAgreementsThunk({ limit: 10 }));

		return () => promise.abort();
	}, [dispatch, lastRanSearch, token, clientId, userId]);

	const handleRefreshList = React.useCallback(() => {
		const currentTime = new Date();
		currentTime.setDate(currentTime.getDate() - 120);
		dispatch(refreshLastSearchDate(currentTime.toUTCString()));
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
			<Table height={505} data={data} loading={isSearching} shouldUpdateScroll={false}>
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
							const date = new Date(rowData.CheckoutDate);
							return <>{date.toLocaleDateString()}</>;
						}}
					</Cell>
				</Column>

				<Column width={120}>
					<HeaderCell>Check-In Date</HeaderCell>
					<Cell>
						{(rowData: AgreementInList) => {
							const date = new Date(rowData.CheckinDate);
							return <>{date.toLocaleDateString()}</>;
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
							const status = rowData.AgreementStatusName;
							if (status === "Close") return <span style={{ color: "#D75252" }}>Closed</span>;
							if (status === "Pending_Payment") return <span style={{ color: "#9119A4" }}>Pending Payments</span>;
							if (status === "Open") return <span style={{ color: "#069F2E" }}>Open</span>;
							return <>{rowData.AgreementStatusName}</>;
						}}
					</Cell>
				</Column>

				<Column width={120}>
					<HeaderCell>Created Date</HeaderCell>
					<Cell>
						{(rowData: AgreementInList) => {
							const date = new Date(rowData.CreatedDate);
							return <>{date.toLocaleDateString()}</>;
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
