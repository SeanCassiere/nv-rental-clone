import React from "react";
import { Panel, Grid, Row, Col, Placeholder } from "rsuite";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { selectViewReservationState } from "../../../shared/redux/store";

const CustomerInformationPanel: React.FunctionComponent = () => {
	const { reservation, isSearching } = useSelector(selectViewReservationState);

	if (isSearching)
		return (
			<Panel style={{ marginTop: 15 }} bordered>
				<Placeholder.Grid rows={5} columns={3} />
			</Panel>
		);

	return (
		<Panel style={{ marginTop: 15 }} bodyFill>
			<Grid fluid>
				<RowItem label='First Name' text={reservation?.reservationview.firstName} />
				<RowItem label='Last Name' text={reservation?.reservationview.lastName} />
				<RowItem label='Home Phone' text={reservation?.reservationview.hPhone} />
				<RowItem label='Work Phone' text={reservation?.reservationview.bPhone} />
				<RowItem label='Mobile Phone' text={reservation?.reservationview.cPhone} />
				<RowItem label='Email' text={reservation?.reservationview.email} />
				<RowItem label='Billing Zip Code' text={reservation?.reservationview.zipCode} />
			</Grid>
		</Panel>
	);
};

export default React.memo(CustomerInformationPanel);

const RowItem = React.memo(({ label, text }: { label: string | React.ReactNode; text: string | React.ReactNode }) => {
	return (
		<Row>
			<Col as={ColItem} md={12} style={{ fontWeight: "bold" }}>
				{label}
			</Col>
			<Col as={ColItem} md={12}>
				{text}
			</Col>
		</Row>
	);
});

const ColItem = styled.div`
	margin-bottom: 10px;
`;
