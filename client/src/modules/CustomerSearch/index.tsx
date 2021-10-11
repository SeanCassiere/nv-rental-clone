import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Table, Panel, Message, Pagination } from "rsuite";
import Moment from "react-moment";

import { useSelector, useDispatch } from "react-redux";
import {
	AppDispatch,
	selectAppConfigState,
	selectAuthUserState,
	selectSearchCustomersState,
} from "../../shared/redux/store";

import AppPageContainer from "../../shared/components/AppPageContainer";
import ViewPageHeader from "../../shared/components/ViewPageHeader";
import { CustomersInList } from "../../shared/interfaces/customers/customerSearch";
import { fetchCustomersThunk } from "../../shared/redux/thunks/allProcessesThunks/searchCustomers";
import { setLastRanDate } from "../../shared/redux/slices/allProcessesSlice";

const { Column, HeaderCell, Cell } = Table;

const CustomerSearchPage: React.FunctionComponent = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { token, clientId, userId } = useSelector(selectAuthUserState);
	const { dates } = useSelector(selectAppConfigState);
	const {
		data: { customers: data, pagination },
		isError,
		errorMsg: searchError,
		isProcessing,
	} = useSelector(selectSearchCustomersState);

	const [limit, setLimit] = useState(10);
	const [page, setPage] = useState(1);

	const makeApiCall = React.useCallback(() => dispatch(fetchCustomersThunk({ limit, page })), [dispatch, limit, page]);

	const handleChangeLimit = (dataKey: number) => {
		setPage(1);
		setLimit(dataKey);
	};

	React.useEffect(() => {
		// const currentTime = Math.floor(Date.now());
		// const lastSearch = lastRun ? Math.floor(Date.parse(lastRun) + 30000) : Math.floor(Date.now());
		// // Skip searching if already search in the last 30 secs

		// if (lastSearch > currentTime) return;
		if (!clientId || !userId) return;

		const promise = makeApiCall();
		return () => promise.abort();
	}, [dispatch, token, clientId, userId, makeApiCall]);

	const handleRefreshList = React.useCallback(() => {
		const currentTime = new Date();
		currentTime.setDate(currentTime.getDate() - 120);
		dispatch(setLastRanDate({ date: currentTime.toUTCString(), key: "searchCustomers" }));
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
				<Message type='error' title='An error occurred' style={{ marginBottom: 10 }}>
					{searchError}
				</Message>
			)}
			<Table height={500} bordered data={data} loading={isProcessing} shouldUpdateScroll={false}>
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
			<div style={{ padding: 20 }}>
				<Pagination
					first
					last
					prev
					next
					ellipsis
					maxButtons={3}
					size='md'
					layout={["total", "-", "pager", "|", "limit", "skip"]}
					limitOptions={[10, 20]}
					limit={limit}
					onChangeLimit={handleChangeLimit}
					onChangePage={setPage}
					activePage={page}
					boundaryLinks
					total={pagination.totalCount}
					disabled={isProcessing}
				/>
			</div>
		</AppPageContainer>
	);
};

export default CustomerSearchPage;
