import React from "react";
import { Panel, Grid, Row, Col, Placeholder } from "rsuite";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { selectViewReservationState } from "../../../redux/store";

const BillingInformationPanel = () => {
	const { reservation, isSearching } = useSelector(selectViewReservationState);

	if (isSearching)
		return (
			<Panel style={{ marginTop: 15 }} bordered>
				<Placeholder.Grid rows={5} columns={3} rowHeight={40} />
			</Panel>
		);

	return (
		<Panel style={{ marginTop: 15 }} bodyFill>
			<Grid fluid>
				<RowItem label='Billing By' text={reservation?.reservtionBillingReview.billingBy} />
				<RowItem label='Name' text={reservation?.reservtionBillingReview.contactName} />
				<RowItem label='Address' text={reservation?.reservtionBillingReview.contactAddress} />
				<RowItem label='Contact No.' text={reservation?.reservtionBillingReview.contactPhone} />
				<RowItem label='Contact Email' text={reservation?.reservtionBillingReview.contactEmail} />
			</Grid>
		</Panel>
	);
};

export default React.memo(BillingInformationPanel);

const RowItem = React.memo(({ label, text }: { label: string | React.ReactNode; text: string | React.ReactNode }) => {
	return (
		<Row>
			<Col componentClass={ColItem} md={12} style={{ fontWeight: "bold" }}>
				{label}
			</Col>
			<Col componentClass={ColItem} md={12}>
				{text}
			</Col>
		</Row>
	);
});

const ColItem = styled.div`
	margin-bottom: 10px;
`;
