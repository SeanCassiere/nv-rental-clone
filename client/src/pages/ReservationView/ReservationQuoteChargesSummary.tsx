import React from "react";
import { Panel, Grid, Row, Col, Placeholder, Button } from "rsuite";
import { useSelector } from "react-redux";
import { selectViewReservationState } from "../../redux/store";

import styled from "styled-components";
import { ReservationMiscViewDataFull } from "../../interfaces/reservations";

const ReservationQuoteChargesSummary = () => {
	const [showTaxMiscCharges, setShowTaxMiscCharges] = React.useState(false);
	const [showNonTaxMiscCharges, setShowNonTaxMiscCharges] = React.useState(false);
	const { reservation, isSearching } = useSelector(selectViewReservationState);

	const handleShowTaxMiscCharges = React.useCallback(() => {
		setShowTaxMiscCharges((t) => !t);
	}, []);

	const handleShowNonTaxMiscCharges = React.useCallback(() => {
		setShowNonTaxMiscCharges((t) => !t);
	}, []);

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
				<RowItem
					label={
						<p>
							Total Miscellaneous Charges&nbsp;
							<Button onClick={handleShowTaxMiscCharges} size='xs'>
								Show More
							</Button>
						</p>
					}
					colText={0}
					currency='$'
					bold
				/>
				{showTaxMiscCharges && (
					<Row>
						<Col smPush={1} xs={24} sm={23} style={{ marginBottom: 10 }}>
							<MisChargeBreakdownInSummary charges={reservation?.miscChargeList} currency='$' taxable />
						</Col>
					</Row>
				)}

				<RowItem
					label={
						<p>
							Total Miscellaneous Charges (No Tax)&nbsp;
							<Button onClick={handleShowNonTaxMiscCharges} size='xs'>
								Show More
							</Button>
						</p>
					}
					colText={0}
					currency='$'
					bold
				/>

				{showNonTaxMiscCharges && (
					<Row>
						<Col smPush={1} xs={24} sm={23} style={{ marginBottom: 10 }}>
							<MisChargeBreakdownInSummary charges={reservation?.miscChargeList} currency='$' />
						</Col>
					</Row>
				)}

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

const MisChargeBreakdownInSummary = React.memo(
	({
		charges,
		taxable,
		currency,
	}: {
		charges: ReservationMiscViewDataFull[] | undefined;
		taxable?: true;
		currency: string;
	}) => {
		if (!charges) return <></>;

		const availableCharges = charges.filter((charge) =>
			taxable ? charge.isTaxable === true : charge.isTaxable === false
		);
		return (
			<>
				{availableCharges.map((item) => (
					<Row key={item.miscChargeId} style={{ marginBottom: 5 }}>
						<Col xs={16} sm={9}>
							{item.name}
						</Col>
						<Col xsHidden sm={10} style={{ textAlign: "right" }}>
							{item.quantity !== 0 && <>{item.quantity}&nbsp;x&nbsp;</>}
							{currency}&nbsp;
							{item.value.toFixed(2)}&nbsp; x&nbsp;{item.unit}
						</Col>
						<Col sx={8} sm={5} style={{ textAlign: "right" }}>
							{currency}
							{item.totalValue.toFixed(2)}
						</Col>
					</Row>
				))}
			</>
		);
	}
);

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
