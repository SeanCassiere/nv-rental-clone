import React from "react";

import { Panel, Grid, Row, Col, Placeholder } from "rsuite";
import { useSelector } from "react-redux";

import { selectViewAgreementState } from "../../shared/redux/store";
import styled from "styled-components";

const AgreementChargesSummary: React.FunctionComponent = () => {
	const { agreement, isSearching } = useSelector(selectViewAgreementState);

	if (isSearching)
		return (
			<Panel header='Agreement Summary' style={{ marginBottom: 10 }} bordered>
				<Placeholder.Grid rows={16} columns={3} />
			</Panel>
		);

	return (
		<Panel header='Agreement Summary' style={{ marginBottom: 10 }} bordered>
			<Grid fluid>
				<RowItem label='Total Rate Charges' leftColText={agreement?.initialRateTotal} currency='$' />
				<RowItem label='Promotion Discount' rightColText={agreement?.promotionDiscount} currency='$' />
				<RowItem label='Final Base Rate' leftColText={agreement?.finalRateTotal} currency='$' bold />
				<RowItem label='Total Miscellaneous Charges' leftColText={agreement?.totMisChargTaxable} currency='$' bold />
				<RowItem
					label='Total Miscellaneous Charges (No Tax)'
					leftColText={agreement?.totMisChargNonTaxable}
					currency='$'
					bold
				/>
				<RowItem label='Extra Mileage Charges' leftColText={agreement?.extraKMCharge} currency='$' />
				<RowItem label='Extra Duration Charges' leftColText={agreement?.extraDayCharge} currency='$' />
				<RowItem label='Subtotal' leftColText={agreement?.subTotal} currency='$' bold />
				<RowItem label='Tax Charges' leftColText={agreement?.totalTax} currency='$' bold />
				<RowItem label='Fuel Charges' leftColText={agreement?.extraFuelCharge} currency='$' />
				<RowItem label='Additional Charges' leftColText={agreement?.additionalCharge} currency='$' />
				<RowItem label='Agreement Charges' leftColText={agreement?.additionalCharges} currency='$' />
				<RowItem label='Total' leftColText={agreement?.totalAmount} currency='$' bold />
				<RowItem label='Amount Paid' leftColText={agreement?.amountPaid} currency='$' />
				<RowItem label='Write Off' leftColText={agreement?.discount} currency='$' />
				<RowItem label='Balance Due' leftColText={agreement?.balanceDue} currency='$' bold />
			</Grid>
		</Panel>
	);
};

const RowItem = React.memo(
	({
		label,
		leftColText,
		rightColText,
		bold,
		currency,
	}: {
		label: string | React.ReactNode;
		leftColText?: number | null | undefined;
		rightColText?: number | null | undefined;
		bold?: true;
		currency: string;
	}) => {
		const [value, setValue] = React.useState<number>(0);

		React.useEffect(() => {
			if (leftColText) {
				if (leftColText === 0.0) setValue(0);
				setValue(leftColText);
			}

			if (rightColText) {
				if (rightColText === 0.0) setValue(0);
				setValue(rightColText);
			}
		}, [leftColText, rightColText]);

		return (
			<Row>
				<Col as={ColItem} style={{ fontWeight: bold ? 900 : 500 }} xs={12} md={14}>
					{label}
				</Col>
				<Col as={ColItem} style={{ fontWeight: bold ? 900 : 500, textAlign: "right" }} xs={6} md={5}>
					{leftColText === 0 ? (
						`${currency}${value.toFixed(2)}`
					) : leftColText ? (
						`${currency}${value.toFixed(2)}`
					) : (
						<></>
					)}
				</Col>
				<Col as={ColItem} style={{ fontWeight: bold ? 900 : 500, textAlign: "right" }} xs={6} md={5}>
					{rightColText === 0 ? (
						`${currency}${value.toFixed(2)}`
					) : rightColText ? (
						`${currency}${value.toFixed(2)}`
					) : (
						<></>
					)}
				</Col>
			</Row>
		);
	}
);

export default React.memo(AgreementChargesSummary);

const ColItem = styled.div`
	margin-bottom: 10px;
`;
