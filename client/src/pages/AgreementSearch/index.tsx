import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Table, Panel, Button, Icon } from "rsuite";

import { useSelector, useDispatch } from "react-redux";
import { selectAuthUserState, selectSearchAgreementsState } from "../../redux/store";

import AppPageContainer from "../../components/AppPageContainer";
import {
	errorAgreements,
	foundAgreements,
	refreshLastSearchDate,
	searchingAgreements,
} from "../../redux/slices/searchAgreements";
import { AgreementInList } from "../../interfaces/agreement";

import { getAgreementsInList } from "../../api/agreementMethods";

const { Column, HeaderCell, Cell } = Table;

const AgreementSearchPage: React.FunctionComponent = () => {
	const dispatch = useDispatch();
	const { token, clientId, userId } = useSelector(selectAuthUserState);
	const { agreements: data, isSearching, lastRanSearch, redoSearch } = useSelector(selectSearchAgreementsState);

	React.useEffect(() => {
		if (!redoSearch) {
			const currentTime = Math.floor(Date.now());
			const lastSearch = lastRanSearch ? Math.floor(Date.parse(lastRanSearch) + 30000) : Math.floor(Date.now());

			// Skip searching if already search in the last 30 secs
			if (lastSearch > currentTime) return;
		}
		if (!clientId || !userId) return;

		dispatch(searchingAgreements());

		getAgreementsInList({ token, clientId, userId })
			.then(({ agreements }) => {
				const currentDateTime = new Date();
				dispatch(foundAgreements({ agreements, lastRanSearch: currentDateTime.toUTCString() }));
			})
			.catch((e) => {
				dispatch(errorAgreements(e.response));
			});
	}, [dispatch, lastRanSearch, token, clientId, userId, redoSearch]);

	const handleRefreshList = React.useCallback(() => {
		dispatch(refreshLastSearchDate());
	}, [dispatch]);

	return (
		<AppPageContainer>
			<Panel header={<b>Agreements</b>} bordered style={{ marginBottom: 10 }} collapsible defaultExpanded>
				<Button onClick={handleRefreshList}>
					<Icon icon='refresh' />
				</Button>
				Agreement Search page
			</Panel>
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

				<Column width={130} fixed='right'>
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
