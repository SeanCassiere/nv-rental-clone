import React from "react";
import { Panel, Grid, Col, Row } from "rsuite";
import { useSelector } from "react-redux";
import { selectAppConfigState, selectCreateReservationState } from "../../../shared/redux/store";
import Moment from "react-moment";

const CreateReservationChargesSummary = () => {
	const {
		dates: { dateTimeLong },
	} = useSelector(selectAppConfigState);
	const {
		userForm: { checkoutDate, checkinDate, checkoutLocationId, checkinLocationId },
		currentNavPosition,
		availableLocations: { locations: fetchedLocations, isSearching: isLocationSearching },
	} = useSelector(selectCreateReservationState);

	const [checkoutLocationName, setCheckoutLocationName] = React.useState("");
	const [checkinLocationName, setCheckinLocationName] = React.useState("");

	React.useEffect(() => {
		if (fetchedLocations === [] || isLocationSearching) return;
		const coLocation = fetchedLocations.filter((i) => i.locationId === checkoutLocationId);
		const ciLocation = fetchedLocations.filter((i) => i.locationId === checkinLocationId);

		setCheckoutLocationName(coLocation[0]?.locationName ?? "");
		setCheckinLocationName(ciLocation[0]?.locationName ?? "");
	}, [fetchedLocations, isLocationSearching, checkoutLocationId, checkinLocationId]);

	return (
		<Panel header='Summary' style={{ minHeight: "30em" }} bordered>
			<Panel style={styles.panel} bordered>
				<Grid fluid>
					<Row style={styles.row}>
						<Col xs={5}>Check-Out</Col>
						<Col xs={9}>
							<Moment format={dateTimeLong}>{checkoutDate}</Moment>
						</Col>
						<Col xs={10}>{checkoutLocationName}</Col>
					</Row>
					<Row styles={styles.row}>
						<Col xs={5}>Check-In</Col>
						<Col xs={9}>
							<Moment format={dateTimeLong}>{checkinDate}</Moment>
						</Col>
						<Col xs={10}>{checkinLocationName}</Col>
					</Row>
				</Grid>
			</Panel>
			currentNavPosition: {currentNavPosition}
		</Panel>
	);
};

const styles = {
	panel: {
		marginBottom: 10,
	},
	row: {
		marginBottom: 10,
	},
};

export default React.memo(CreateReservationChargesSummary);
