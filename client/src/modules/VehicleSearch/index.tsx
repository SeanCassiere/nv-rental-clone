import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Table, Panel, Message, Pagination } from "rsuite";

import { useSelector, useDispatch } from "react-redux";
import {
	AppDispatch,
	selectAppKeyValuesState,
	selectAuthUserState,
	selectSearchVehiclesState,
} from "../../shared/redux/store";

import AppPageContainer from "../../shared/components/AppPageContainer";
import ViewPageHeader from "../../shared/components/ViewPageHeader";
import { VehiclesInList } from "../../shared/interfaces/vehicles/vehicleSearch";
import { fetchVehiclesThunk } from "../../shared/redux/thunks/allProcessesThunks/searchVehicles";
import { setLastRanDate } from "../../shared/redux/slices/allProcessesSlice";

const { Column, HeaderCell, Cell } = Table;

const VehicleSearchPage: React.FunctionComponent = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { token, clientId, userId } = useSelector(selectAuthUserState);
	const {
		vehicleValues: { vehicleStatuses },
	} = useSelector(selectAppKeyValuesState);
	const {
		data: { vehicles: data, pagination },
		isError,
		errorMsg: searchError,
		isProcessing,
	} = useSelector(selectSearchVehiclesState);

	const [limit, setLimit] = useState(10);
	const [page, setPage] = useState(1);

	const makeApiCall = React.useCallback(() => dispatch(fetchVehiclesThunk({ limit, page })), [dispatch, limit, page]);

	React.useEffect(() => {
		if (!clientId || !userId) return;

		const promise = makeApiCall();
		return () => promise.abort();
	}, [dispatch, token, clientId, userId, makeApiCall]);

	const handleRefreshList = React.useCallback(() => {
		const currentTime = new Date();
		currentTime.setDate(currentTime.getDate() - 120);
		dispatch(setLastRanDate({ date: currentTime.toUTCString(), key: "searchVehicles" }));
	}, [dispatch]);

	const handleChangeLimit = (dataKey: number) => {
		setPage(1);
		setLimit(dataKey);
	};

	return (
		<AppPageContainer>
			<Panel
				header={<ViewPageHeader title='Search Vehicles' refreshFunction={handleRefreshList} refresh />}
				bordered
				style={{ marginBottom: 10 }}
				defaultExpanded
			>
				Vehicle Search page
			</Panel>
			{isError && (
				<Message type='error' title='An error occurred' style={{ marginBottom: 10 }}>
					{searchError}
				</Message>
			)}
			<Table height={500} bordered data={data} loading={isProcessing} shouldUpdateScroll={false}>
				<Column width={120}>
					<HeaderCell>Vehicle No.</HeaderCell>
					<Cell dataKey='VehicleNo' />
				</Column>

				<Column width={120}>
					<HeaderCell>License No.</HeaderCell>
					<Cell dataKey='LicenseNo' />
				</Column>

				<Column width={110}>
					<HeaderCell>Color</HeaderCell>
					<Cell dataKey='Color' />
				</Column>

				<Column width={110}>
					<HeaderCell>Make</HeaderCell>
					<Cell dataKey='VehicleMakeName' />
				</Column>

				<Column width={110}>
					<HeaderCell>Model</HeaderCell>
					<Cell dataKey='ModelName' />
				</Column>

				<Column width={110}>
					<HeaderCell>Year</HeaderCell>
					<Cell dataKey='Year' />
				</Column>

				<Column width={110}>
					<HeaderCell>Status</HeaderCell>
					<Cell>
						{(rowData: VehiclesInList) => {
							const rowStatus = vehicleStatuses.filter((stat) => stat.id === rowData.StatusId);
							return <>{rowStatus[0]?.name}</>;
						}}
					</Cell>
				</Column>

				<Column width={200}>
					<HeaderCell>Current Location</HeaderCell>
					<Cell dataKey='CurrentLocationName' />
				</Column>

				<Column width={150}>
					<HeaderCell>Current Odometer</HeaderCell>
					<Cell dataKey='CurrentOdometer' />
				</Column>

				<Column minWidth={150} flexGrow={1} fixed='right'>
					<HeaderCell>Action</HeaderCell>

					<Cell>
						{(rowData: VehiclesInList) => {
							return (
								<span>
									<RouterLink to={`/vehicles/${rowData.VehicleId}`}>View</RouterLink>
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

export default VehicleSearchPage;
