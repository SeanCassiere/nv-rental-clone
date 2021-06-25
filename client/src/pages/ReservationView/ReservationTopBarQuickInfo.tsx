import React from "react";
import { Grid, Row, Col, Icon } from "rsuite";
import { useSelector } from "react-redux";

import { selectAppKeyValuesState, selectViewReservationState } from "../../redux/store";

import PillTopBarItem from "../../components/PillTopBarItem";

const ReservationTopBarQuickInfo = () => {
	const [statusLabel, setStatusLabel] = React.useState("");
	const { reservation, isSearching } = useSelector(selectViewReservationState);
	const {
		reservationValues: { reservationStatuses },
	} = useSelector(selectAppKeyValuesState);

	React.useEffect(() => {
		if (isSearching) return;

		const arrayed = reservationStatuses.filter((stat) => stat.id === reservation?.reservationview.statusId);

		if (!arrayed) return;

		setStatusLabel(arrayed[0]?.name);
	}, [reservationStatuses, reservation, isSearching]);
	return (
		<Grid style={{ marginBottom: 10 }} fluid>
			<Row>
				<Col sm={12} md={12} lg={6}>
					<PillTopBarItem
						keyLabel='No.'
						valueLabel={reservation?.reservationview.reservationNumber}
						isSearching={isSearching}
					/>
				</Col>
				<Col sm={12} md={12} lg={6}>
					<PillTopBarItem
						keyLabel={<Icon icon='user' />}
						valueLabel={`${reservation?.reservationview.firstName} ${reservation?.reservationview.lastName}`}
						isSearching={isSearching}
					/>
				</Col>
				<Col sm={12} md={12} lg={6}>
					<PillTopBarItem
						keyLabel={<Icon icon='home' />}
						valueLabel={reservation?.reservationview.hPhone}
						isSearching={isSearching}
					/>
				</Col>
				<Col sm={12} md={12} lg={6}>
					<PillTopBarItem keyLabel='Status' valueLabel={statusLabel} isSearching={isSearching} />
				</Col>
			</Row>
		</Grid>
	);
};

export default React.memo(ReservationTopBarQuickInfo);
