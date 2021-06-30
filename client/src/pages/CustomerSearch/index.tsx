import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Table, Panel, Message } from "rsuite";
import Moment from "react-moment";

import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, selectAppConfigState, selectAuthUserState, selectSearchCustomersState } from "../../redux/store";

import AppPageContainer from "../../components/AppPageContainer";
import ViewPageHeader from "../../components/ViewPageHeader";
import { CustomersInList } from "../../interfaces/customers/customerSearch";
import { fetchCustomersThunk } from "../../redux/thunks/searchCustomersThunks";
import { refreshLastCustomersSearchDate } from "../../redux/slices/searchCustomersSlice";

const { Column, HeaderCell, Cell } = Table;

const CustomerSearchPage: React.FunctionComponent = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { token, clientId, userId } = useSelector(selectAuthUserState);
	const { dates } = useSelector(selectAppConfigState);
	const {
		customers: data,
		isError,
		error: searchError,
		isSearching,
		lastRanSearch,
	} = useSelector(selectSearchCustomersState);

	React.useEffect(() => {
		const currentTime = Math.floor(Date.now());
		const lastSearch = lastRanSearch ? Math.floor(Date.parse(lastRanSearch) + 30000) : Math.floor(Date.now());
		// Skip searching if already search in the last 30 secs

		if (lastSearch > currentTime) return;
		if (!clientId || !userId) return;

		const promise = dispatch(fetchCustomersThunk({ limit: 15 }));
		return () => promise.abort();
	}, [dispatch, lastRanSearch, token, clientId, userId]);

	const handleRefreshList = React.useCallback(() => {
		const currentTime = new Date();
		currentTime.setDate(currentTime.getDate() - 120);
		dispatch(refreshLastCustomersSearchDate(currentTime.toUTCString()));
	}, [dispatch]);

	return (
		<AppPageContainer>
			<Panel
				header={<ViewPageHeader title='Search Customers' refreshFunction={handleRefreshList} refresh />}
				bordered
				style={{ marginBottom: 10 }}
				defaultExpanded
			>
				Customer Search page
			</Panel>
			{isError && (
				<Message type='error' title='An error occurred' description={searchError} style={{ marginBottom: 10 }} />
			)}
			<Table height={500} bordered data={data} loading={isSearching} shouldUpdateScroll={false}>
				<Column width={120}>
					<HeaderCell>First Name</HeaderCell>
					<Cell dataKey='FirstName' />
				</Column>

				<Column width={120}>
					<HeaderCell>Last Name</HeaderCell>
					<Cell dataKey='LastName' />
				</Column>

				<Column width={110}>
					<HeaderCell>Phone No.</HeaderCell>
					<Cell dataKey='hPhone' />
				</Column>

				<Column width={120}>
					<HeaderCell>License No.</HeaderCell>
					<Cell dataKey='LicenseNumber' />
				</Column>

				<Column width={120}>
					<HeaderCell>Date of Birth</HeaderCell>
					<Cell>
						{(rowData: CustomersInList) => {
							if (rowData.DateOfbirth) {
								return <Moment format={dates.dateShort}>{rowData.DateOfbirth}</Moment>;
							}
						}}
					</Cell>
				</Column>

				<Column width={270}>
					<HeaderCell>Address</HeaderCell>
					<Cell dataKey='Address1' />
				</Column>

				<Column width={140}>
					<HeaderCell>City</HeaderCell>
					<Cell dataKey='City' />
				</Column>

				<Column width={100}>
					<HeaderCell>State</HeaderCell>
					<Cell dataKey='StateName' />
				</Column>

				<Column width={100}>
					<HeaderCell>ZIP</HeaderCell>
					<Cell dataKey='ZipCode' />
				</Column>

				<Column width={100}>
					<HeaderCell>Country</HeaderCell>
					<Cell dataKey='CountryName' />
				</Column>

				<Column minWidth={150} flexGrow={1} fixed='right'>
					<HeaderCell>Action</HeaderCell>

					<Cell>
						{(rowData: CustomersInList) => {
							return (
								<span>
									<RouterLink to={`/customers/${rowData.CustomerId}`}>View</RouterLink>
									&nbsp;|&nbsp;
									<RouterLink to={`/customers/${rowData.CustomerId}/edit`}>Edit</RouterLink>
								</span>
							);
						}}
					</Cell>
				</Column>
			</Table>
		</AppPageContainer>
	);
};

export default CustomerSearchPage;
