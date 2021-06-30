import React from "react";
import {
	Panel,
	FlexboxGrid,
	Form,
	FormGroup,
	ControlLabel,
	SelectPicker,
	Grid,
	Row,
	Col,
	DatePicker,
	Button,
	Alert,
} from "rsuite";
import { useDispatch, useSelector } from "react-redux";

import {
	AppDispatch,
	selectAppConfigState,
	selectAppKeyValuesState,
	selectCreateReservationState,
} from "../../../redux/store";
import {
	setCreateResCheckInDate,
	setCreateResCheckInLocationId,
	setCreateResCheckOutDate,
	setCreateResCheckOutLocationId,
	setCreateResTypeId,
	setJumpCreateResNavPosition,
} from "../../../redux/slices/createReservationSlice";
import { fetchCreateResLocationsThunk } from "../../../redux/thunks/createReservationThunks";

const SelectReservationDetails = () => {
	const dispatch = useDispatch<AppDispatch>();
	const {
		availableLocations: { locations: fetchedLocations, isSearching: isLocationSearching },
		userForm: { checkoutLocationId, checkinLocationId, reservationTypeId, checkoutDate, checkinDate },
	} = useSelector(selectCreateReservationState);

	const {
		reservationValues: { reservationTypes },
	} = useSelector(selectAppKeyValuesState);

	const {
		dates: { dateTimeLong },
	} = useSelector(selectAppConfigState);

	const [locations, setLocations] = React.useState<{ value: number; label: string }[]>([]);
	const [resTypes, setResTypes] = React.useState<{ value: number; label: string }[]>([]);

	// Formatting the available locations
	React.useEffect(() => {
		if (isLocationSearching || fetchedLocations === []) return;

		const data = fetchedLocations.map((item) => {
			return { value: item.locationId, label: item.locationName };
		});

		setLocations(data);
	}, [fetchedLocations, isLocationSearching]);

	// Formatting the reservation types
	React.useEffect(() => {
		if (reservationTypes === []) return;

		const types = reservationTypes
			.filter((i) => i.isDeleted !== true)
			.map((item) => {
				return { value: item.typeId, label: item.typeName };
			});

		setResTypes(types);
	}, [reservationTypes]);

	// Setting initial dates to Redux
	React.useEffect(() => {
		if (checkoutDate !== "" || checkinDate !== "") return;
		console.log("setting date");
		const today = new Date();
		const tomorrow = new Date(Date.now() + 3600 * 1000 * 24);
		dispatch(setCreateResCheckOutDate(today.toISOString()));
		dispatch(setCreateResCheckInDate(tomorrow.toISOString()));
	}, [checkoutDate, checkinDate, dispatch]);

	// Fetching Data
	React.useEffect(() => {
		if (fetchedLocations.length !== 0) return;

		dispatch(fetchCreateResLocationsThunk());
	}, [dispatch, fetchedLocations]);

	const handleNextPage = React.useCallback(() => {
		if (!reservationTypeId || !checkoutLocationId || !checkinLocationId) {
			Alert.warning("Please enter in all the information");
			return;
		}
		dispatch(setJumpCreateResNavPosition("customer"));
	}, [dispatch, reservationTypeId, checkoutLocationId, checkinLocationId]);

	return (
		<FlexboxGrid align='top'>
			<FlexboxGrid.Item colspan={24}>
				<Panel header='Reservation Information' bordered>
					<Form>
						<Grid fluid>
							<Row style={{ marginBottom: 20 }}>
								<FormGroup>
									<Col xs={12}>
										<ControlLabel>Reservation Type</ControlLabel>
									</Col>
									<Col xs={12}>
										<SelectPicker
											data={resTypes}
											searchable={false}
											cleanable={false}
											onSelect={(id) => dispatch(setCreateResTypeId(id))}
											value={reservationTypeId}
											block
										/>
									</Col>
								</FormGroup>
							</Row>
							<Panel bodyFill style={{ marginBottom: 20 }}>
								<Row style={{ marginBottom: 10 }}>
									<Col xs={12}>
										<FormGroup>
											<ControlLabel>Check-Out Date</ControlLabel>
											<DatePicker
												format={dateTimeLong}
												showMeridian
												defaultValue={new Date()}
												value={new Date(checkoutDate)}
												block
												cleanable={false}
												onChange={(date) => {
													let newCheckIn = new Date(date);
													newCheckIn.setDate(newCheckIn.getDate() + 1);
													dispatch(setCreateResCheckOutDate(date.toISOString()));
													dispatch(setCreateResCheckInDate(newCheckIn.toISOString()));
												}}
											/>
										</FormGroup>
									</Col>
									<Col xs={12}>
										<FormGroup>
											<ControlLabel>Location</ControlLabel>
											<SelectPicker
												data={locations}
												cleanable={false}
												disabled={isLocationSearching}
												value={checkoutLocationId}
												onSelect={(e) => dispatch(setCreateResCheckOutLocationId(e))}
												block
											/>
										</FormGroup>
									</Col>
								</Row>
							</Panel>
							<Panel bodyFill>
								<Row style={{ marginBottom: 10 }}>
									<Col xs={12}>
										<FormGroup>
											<ControlLabel>Check-In Date</ControlLabel>
											<DatePicker
												format={dateTimeLong}
												showMeridian
												block
												defaultValue={new Date(Date.now() + 3600 * 1000 * 24)}
												value={new Date(checkinDate)}
												cleanable={false}
												disabledDate={(date) => {
													const cDate = new Date(checkoutDate);
													if (date) if (date < cDate) return true;

													return false;
												}}
												onChange={(date) => dispatch(setCreateResCheckInDate(date.toISOString()))}
											/>
										</FormGroup>
									</Col>
									<Col xs={12}>
										<FormGroup>
											<ControlLabel>Location</ControlLabel>
											<SelectPicker
												data={locations}
												disabled={isLocationSearching}
												cleanable={false}
												value={checkinLocationId}
												onSelect={(e) => dispatch(setCreateResCheckInLocationId(e))}
												block
											/>
										</FormGroup>
									</Col>
								</Row>
							</Panel>
						</Grid>
					</Form>
				</Panel>
			</FlexboxGrid.Item>
			<FlexboxGrid.Item componentClass={Col} colspan={24} style={{ margin: "10px 0" }}>
				<Panel style={{ padding: "10px 0px" }} bodyFill>
					<FlexboxGrid justify='end'>
						<FlexboxGrid.Item componentClass={Col} xs={24} colspan={10} style={{ textAlign: "right" }}>
							<Button onClick={handleNextPage} appearance='primary' type='submit'>
								Next
							</Button>
						</FlexboxGrid.Item>
					</FlexboxGrid>
				</Panel>
			</FlexboxGrid.Item>
		</FlexboxGrid>
	);
};

export default React.memo(SelectReservationDetails);
