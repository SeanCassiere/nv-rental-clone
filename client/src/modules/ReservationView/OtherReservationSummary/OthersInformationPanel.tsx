import React from "react";
import { Panel, Grid, Row, Col, Placeholder } from "rsuite";
import { useSelector } from "react-redux";
import { selectViewReservationState } from "../../../shared/redux/store";

const OthersInformationPanel = () => {
	const { reservation, isSearching } = useSelector(selectViewReservationState);

	if (isSearching)
		return (
			<Panel style={{ marginTop: 15 }} bordered>
				<Placeholder.Grid rows={2} columns={1} />
			</Panel>
		);

	return (
		<Panel style={{ marginTop: 15 }} bordered>
			<Grid fluid>
				<Row>
					<Col xs={10}>PO</Col>
					<Col xs={14}>{reservation?.reservationview?.poNo}</Col>
				</Row>
				<Row>
					<Col xs={10}>RO</Col>
					<Col xs={14}>{reservation?.reservationview?.roNo}</Col>
				</Row>
			</Grid>
		</Panel>
	);
};

export default React.memo(OthersInformationPanel);
