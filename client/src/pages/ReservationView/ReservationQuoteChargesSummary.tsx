import React from "react";
import { Panel, Grid, Row, Col, Placeholder, Button, Icon } from "rsuite";
import { useSelector } from "react-redux";
import Moment from "react-moment";
import { selectAppConfigState, selectViewReservationState } from "../../redux/store";

import styled from "styled-components";
import { ReservationMiscViewDataFull } from "../../interfaces/reservations/reservationView";

const ReservationQuoteChargesSummary = () => {
	const [showTaxMiscCharges, setShowTaxMiscCharges] = React.useState(false);
	const [showNonTaxMiscCharges, setShowNonTaxMiscCharges] = React.useState(false);
	const { reservation, reservationSummary, isSearching } = useSelector(selectViewReservationState);

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
				<RateBreakDownSummary />
				<RowItem label='Base Rate' colText={reservationSummary?.baseRate} currency='$' />
				<RowItem label='Promotion Discount' colText={reservationSummary?.promotionDiscount} currency='$' />
				<RowItem label='Final Base Rate' colText={reservationSummary?.finalBaseRate} currency='$' />
				<RowItem
					label={
						<p>
							<Button onClick={handleShowTaxMiscCharges} size='xs'>
								<Icon icon={showTaxMiscCharges ? "angle-up" : "angle-down"} />
							</Button>
							&nbsp; Total Miscellaneous Charges
						</p>
					}
					colText={reservationSummary?.totalMiscChargesTaxable}
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
							<Button onClick={handleShowNonTaxMiscCharges} size='xs'>
								<Icon icon={showNonTaxMiscCharges ? "angle-up" : "angle-down"} />
							</Button>
							&nbsp; Total Miscellaneous Charges (No Tax)
						</p>
					}
					colText={reservationSummary?.totalMiscChargesNonTaxable}
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

				<RowItem label='Pre-Adjustment' colText={reservationSummary?.preAdjustment} currency='$' />
				<RowItem label='Subtotal' colText={reservationSummary?.subTotal} currency='$' bold />
				<RowItem label='Tax Charges' colText={reservationSummary?.totalTax} currency='$' />
				<RowItem label='Additional Charges' colText={reservation?.reservationview.additionalCharge} currency='$' />
				<RowItem label='Total' colText={reservationSummary?.total} currency='$' bold />
				<RowItem label='Advance Paid' colText={reservationSummary?.advancePayment} currency='$' />
				<RowItem label='Balance Due' colText={reservationSummary?.balanceDue} currency='$' bold />
				<RowItem
					label='Cancellation Charge'
					colText={reservation?.reservationview.cancellationCharge ?? 0}
					currency='$'
				/>
			</Grid>
		</Panel>
	);
};

const RateBreakDownSummary = React.memo(() => {
	const { reservationSummary, reservation } = useSelector(selectViewReservationState);
	const {
		dates: { dateTimeLong },
	} = useSelector(selectAppConfigState);

	return (
		<Row style={{ marginBottom: 10 }}>
			<Col>
				<Panel style={{ marginBottom: 10 }} bordered>
					<Row style={{ marginBottom: 10 }}>
						<Col xs={10} style={{ fontWeight: 700 }}>
							Start Date
						</Col>
						<Col xs={12} style={{ fontWeight: 700 }}>
							<Moment format={dateTimeLong}>{reservation?.reservationview.startDate}</Moment>
						</Col>
					</Row>
					<Row style={{ marginBottom: 10 }}>
						<Col xs={10} style={{ fontWeight: 700 }}>
							End Date
						</Col>
						<Col xs={12} style={{ fontWeight: 700 }}>
							<Moment format={dateTimeLong}>{reservation?.reservationview.endDate}</Moment>
						</Col>
					</Row>
					{reservationSummary?.rateSummaryItems.map((item, idx) => (
						<RateBreakDownItem key={idx} label={item.type} qty={item.units} cost={item.rate} />
					))}
				</Panel>
			</Col>
		</Row>
	);
});

const RateBreakDownItem = React.memo(({ label, qty, cost }: { label: React.ReactNode; qty: number; cost: number }) => (
	<Row style={{ marginBottom: 10 }}>
		<Col xs={10}>{label}</Col>
		<Col xs={6}>{qty}&nbsp;x</Col>
		<Col xs={6}>{cost.toFixed(2)}</Col>
	</Row>
));

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
					{colText === 0 ? (
						`${currency}${value.toFixed(2)}`
					) : colText ? (
						`${currency}${value.toFixed(2)}`
					) : (
						<>{currency}0.00</>
					)}
				</Col>
			</Row>
		);
	}
);

const ColItem = styled.div`
	margin-bottom: 10px;
`;

export default React.memo(ReservationQuoteChargesSummary);
