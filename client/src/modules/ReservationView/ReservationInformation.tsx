import React from "react";
import { useSelector } from "react-redux";
import { Panel, Placeholder, Grid, Row, Col } from "rsuite";
import styled from "styled-components";
import Moment from "react-moment";

import { selectAppConfigState, selectAppKeyValuesState, selectViewReservationState } from "../../shared/redux/store";

const ReservationInformation = () => {
	const [statusLabel, setStatusLabel] = React.useState("");

	const { isSearching, reservation } = useSelector(selectViewReservationState);
	const {
		reservationValues: { reservationStatuses },
	} = useSelector(selectAppKeyValuesState);
	const {
		dates: { dateTimeLong },
	} = useSelector(selectAppConfigState);

	React.useEffect(() => {
		if (isSearching) return;

		const arrayed = reservationStatuses.filter((stat) => stat.id === reservation?.reservationview.statusId);

		if (!arrayed) return;

		setStatusLabel(arrayed[0]?.name);
	}, [reservationStatuses, reservation, isSearching]);

	if (isSearching)
		return (
			<Panel header='Reservation Information' bordered style={{ marginBottom: 10 }}>
				<Placeholder.Grid rows={10} columns={2} />
			</Panel>
		);

	return (
		<Panel header='Reservation Information' bordered style={{ marginBottom: 10 }}>
			<Grid fluid>
				<RowItem label='Reservation No.' text={reservation?.reservationview.reservationNumber} />
				<RowItem label='Reservation Type' text={reservation?.reservationview.reservationType} />
				<RowItem label='Status' text={statusLabel} />
				<RowItem
					label='Created Date'
					text={<Moment format={dateTimeLong}>{reservation?.reservationview?.createdDate}</Moment>}
				/>
				<RowItem label='Check-Out Location' text={reservation?.reservationview.startLocationName} />
				<RowItem label='Check-In Location' text={reservation?.reservationview.endLocationName} />
				<RowItem
					label='Check-Out Date'
					text={<Moment format={dateTimeLong}>{reservation?.reservationview.startDate}</Moment>}
				/>
				<RowItem
					label='Check-In Date'
					text={<Moment format={dateTimeLong}>{reservation?.reservationview.endDate}</Moment>}
				/>
				<RowItem label='Created By' text={reservation?.reservationview.createdBy} />
				<RowItem label='Updated By' text={reservation?.reservationview.lastUpdateByName} />
			</Grid>
		</Panel>
	);
};

export default React.memo(ReservationInformation);

const RowItem = React.memo(({ label, text }: { label: string | React.ReactNode; text: React.ReactNode }) => {
	return (
		<Row>
			<Col componentClass={ColItem} md={12}>
				<b>{label}</b>
			</Col>
			<Col componentClass={ColItem} md={12}>
				{text ? text : <></>}
			</Col>
		</Row>
	);
});

const ColItem = styled.div`
	margin-bottom: 10px;
`;
