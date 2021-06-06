import React from "react";
import { useParams } from "react-router-dom";
import { Panel, Grid, Row, Col, Placeholder } from "rsuite";
import { useSelector } from "react-redux";

import { selectViewAgreementState } from "../../redux/store";
import styled from "styled-components";

type PageParams = {
	id: string;
};

const AgreementChargesSummary = () => {
	const { id } = useParams<PageParams>();
	const { agreement } = useSelector(selectViewAgreementState);
	const loading = true;

	React.useEffect(() => {
		console.log(id);
	}, [id]);

	return (
		<Panel header='Agreement Summary' style={{ marginBottom: 10 }} bordered>
			<Grid fluid>
				<RowItem label='Total Rate Charges' leftColText={agreement?.initialRateTotal} currency='$' loading={loading} />
				<RowItem
					label='Promotion Discount'
					rightColText={agreement?.promotionDiscount}
					currency='$'
					loading={loading}
				/>
				<RowItem label='Final Base Rate' leftColText={agreement?.finalRateTotal} currency='$' loading={loading} bold />
				<RowItem
					label='Total Miscellaneous Charges'
					leftColText={agreement?.totMisChargTaxable}
					currency='$'
					loading={loading}
					bold
				/>
				<RowItem
					label='Total Miscellaneous Charges (No Tax)'
					leftColText={agreement?.totMisChargNonTaxable}
					currency='$'
					loading={loading}
					bold
				/>
				<RowItem label='Extra Mileage Charges' leftColText={agreement?.extraKMCharge} currency='$' loading={loading} />
				<RowItem
					label='Extra Duration Charges'
					leftColText={agreement?.extraDayCharge}
					currency='$'
					loading={loading}
				/>
				<RowItem label='Subtotal' leftColText={agreement?.subTotal} currency='$' loading={loading} bold />
				<RowItem label='Tax Charges' leftColText={agreement?.totalTax} currency='$' loading={loading} bold />
				<RowItem label='Fuel Charges' leftColText={agreement?.extraFuelCharge} currency='$' loading={loading} />
				<RowItem label='Additional Charges' leftColText={agreement?.additionalCharge} currency='$' loading={loading} />
				<RowItem label='Agreement Charges' leftColText={agreement?.additionalCharges} currency='$' loading={loading} />
				<RowItem label='Total' leftColText={agreement?.totalAmount} currency='$' loading={loading} bold />
				<RowItem label='Amount Paid' leftColText={agreement?.amountPaid} currency='$' loading={loading} />
				<RowItem label='Write Off' leftColText={agreement?.discount} currency='$' loading={loading} />
				<RowItem label='Balance Due' leftColText={agreement?.balanceDue} currency='$' loading={loading} bold />
			</Grid>
		</Panel>
	);
};

const RowItem: React.FunctionComponent<{
	label: string | React.ReactNode;
	leftColText?: number | null | undefined;
	rightColText?: number | null | undefined;
	bold?: true;
	currency: string;
	loading: boolean;
}> = React.memo(({ label, leftColText, rightColText, bold, currency, loading }) => {
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
	if (loading) {
		return (
			<Row>
				<Col componentClass={ColItem} style={{ fontWeight: bold ? 900 : 500 }} md={14}>
					{label}
				</Col>
				<Col componentClass={ColItem} style={{ fontWeight: bold ? 900 : 500 }} md={5}>
					<Placeholder.Graph width={80} height={20} active />
				</Col>
				<Col componentClass={ColItem} style={{ fontWeight: bold ? 900 : 500 }} md={5}>
					<Placeholder.Graph width={80} height={20} active />
				</Col>
			</Row>
		);
	}

	return (
		<Row>
			<Col componentClass={ColItem} style={{ fontWeight: bold ? 900 : 500 }} md={14}>
				{label}
			</Col>
			<Col componentClass={ColItem} style={{ fontWeight: bold ? 900 : 500, textAlign: "right" }} md={5}>
				{leftColText === 0 ? `${currency}${value.toFixed(2)}` : leftColText ? `${currency}${value.toFixed(2)}` : <></>}
			</Col>
			<Col componentClass={ColItem} style={{ fontWeight: bold ? 900 : 500, textAlign: "right" }} md={5}>
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
});

export default React.memo(AgreementChargesSummary);

const ColItem = styled.div`
	margin-bottom: 10px;
`;
