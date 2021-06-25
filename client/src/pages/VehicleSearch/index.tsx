import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Table, Panel, Message } from "rsuite";

import { useSelector, useDispatch } from "react-redux";
import {
	AppDispatch,
	selectAppKeyValuesState,
	selectAuthUserState,
	selectSearchVehiclesState,
} from "../../redux/store";

import AppPageContainer from "../../components/AppPageContainer";
import ViewPageHeader from "../../components/ViewPageHeader";
import { VehiclesInList } from "../../interfaces/vehicles";
import { fetchVehiclesThunk } from "../../redux/thunks/searchVehiclesThunks";
import { refreshLastVehicleSearchDate } from "../../redux/slices/searchVehiclesSlice";

const { Column, HeaderCell, Cell } = Table;

const VehicleSearchPage: React.FunctionComponent = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { token, clientId, userId } = useSelector(selectAuthUserState);
	const {
		vehicleValues: { vehicleStatuses },
	} = useSelector(selectAppKeyValuesState);
	const {
		vehicles: data,
		isError,
		error: searchError,
		isSearching,
		lastRanSearch,
	} = useSelector(selectSearchVehiclesState);

	React.useEffect(() => {
		const currentTime = Math.floor(Date.now());
		const lastSearch = lastRanSearch ? Math.floor(Date.parse(lastRanSearch) + 30000) : Math.floor(Date.now());
		// Skip searching if already search in the last 30 secs

		if (lastSearch > currentTime) return;
		if (!clientId || !userId) return;

		const promise = dispatch(fetchVehiclesThunk({ limit: 15 }));
		return () => promise.abort();
	}, [dispatch, lastRanSearch, token, clientId, userId]);

	const handleRefreshList = React.useCallback(() => {
		const currentTime = new Date();
		currentTime.setDate(currentTime.getDate() - 120);
		dispatch(refreshLastVehicleSearchDate(currentTime.toUTCString()));
	}, [dispatch]);

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
				<Message type='error' title='An error occurred' description={searchError} style={{ marginBottom: 10 }} />
			)}
			<Table height={500} bordered data={data} loading={isSearching} shouldUpdateScroll={false}>
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
		</AppPageContainer>
	);
};

export default VehicleSearchPage;
