import React from "react";
import { Panel, Grid, Row, Col, Placeholder } from "rsuite";
import { useSelector } from "react-redux";
import { selectViewReservationState } from "../../redux/store";

import styled from "styled-components";

const ReservationQuoteChargesSummary = () => {
	const { reservation, isSearching } = useSelector(selectViewReservationState);

	if (isSearching)
		return (
			<Panel header='Reservation Quote Summary' style={{ marginBottom: 10 }} bordered>
				<Placeholder.Grid rows={16} columns={3} />
			</Panel>
		);

	return (
		<Panel header='Reservation Quote Summary' style={{ marginBottom: 10 }} bordered>
			<Grid fluid>
				<RowItem label='Base Rate' colText={reservation?.reservationview.basePrice} currency='$' />
				<RowItem label='Promotion Discount' colText={reservation?.reservationview.totalDiscount} currency='$' />
				<RowItem label='Final Base Rate' colText={reservation?.reservationview.basePrice} currency='$' />
				<RowItem label='Total Miscellaneous Charges' colText={0} currency='$' />
				<RowItem label='Total Miscellaneous Charges (No Tax)' colText={0} currency='$' />
				<RowItem label='Pre-Adjustment' colText={reservation?.reservationview.preAdjustment} currency='$' />
				<RowItem label='Subtotal' colText={0} currency='$' bold />
				<RowItem label='Tax Charges' colText={0} currency='$' />
				<RowItem label='Additional Charges' colText={reservation?.reservationview.additionalCharge} currency='$' />
				<RowItem label='Total' colText={0} currency='$' bold />
				<RowItem label='Advanced Paid' colText={reservation?.reservationview.advancedPayment} currency='$' />
				<RowItem label='Balance Due' colText={0} currency='$' bold />
				<RowItem
					label='Cancellation Charge'
					colText={reservation?.reservationview.cancellationCharge ?? 0}
					currency='$'
				/>
			</Grid>
		</Panel>
	);
};

const RowItem = React.memo(
	({
		label,
		colText,
		bold,
		currency,
	}: {
		label: string | React.ReactNode;
		colText: number | null | undefined;
		bold?: true;
		currency: string;
	}) => {
		const [value, setValue] = React.useState<number>(0);

		React.useEffect(() => {
			if (colText) {
				if (colText === 0.0) setValue(0);
				setValue(colText);
			}
		}, [colText]);

		return (
			<Row>
				<Col componentClass={ColItem} style={{ fontWeight: bold ? 900 : 500 }} xs={16} md={16}>
					{label}
				</Col>
				<Col componentClass={ColItem} style={{ fontWeight: bold ? 900 : 500, textAlign: "right" }} xs={8} md={8}>
					{colText === 0 ? `${currency}${value.toFixed(2)}` : colText ? `${currency}${value.toFixed(2)}` : <></>}
				</Col>
			</Row>
		);
	}
);

const ColItem = styled.div`
	margin-bottom: 10px;
`;

export default React.memo(ReservationQuoteChargesSummary);
