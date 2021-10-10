import React from "react";
import { Panel, Grid, Row, Col, Placeholder } from "rsuite";
import { useSelector } from "react-redux";
import { selectViewAgreementState } from "../../../shared/redux/store";

const RatesPanel: React.FunctionComponent = () => {
	const { agreement, isSearching } = useSelector(selectViewAgreementState);
	const [checkInDate, setCheckInDate] = React.useState("");
	const [checkInTime, setCheckInTime] = React.useState("");
	const [checkOutDate, setCheckOutDate] = React.useState("");
	const [checkOutTime, setCheckOutTime] = React.useState("");

	React.useEffect(() => {
		if (!agreement) return;
		if (agreement.checkinDate) {
			const date = new Date(agreement.checkinDate);
			setCheckInDate(`${date.toLocaleDateString()}`);
			setCheckInTime(`${date.toLocaleTimeString()}`);
		}
		if (agreement.checkoutDate) {
			const date = new Date(agreement.checkoutDate);
			setCheckOutDate(`${date.toLocaleDateString()}`);
			setCheckOutTime(`${date.toLocaleTimeString()}`);
		}
	}, [agreement]);

	if (isSearching)
		return (
			<Panel style={{ marginTop: 15 }} bordered>
				<Placeholder.Grid rows={7} columns={3} />
			</Panel>
		);

	return (
		<Panel style={{ marginTop: 15 }} bordered>
			<Grid fluid>
				<RatesRowItem label='Start Date' leftColText={checkInDate} rightColText={checkInTime} isLabelBold isTextBold />
				<RatesRowItem label='End Date' leftColText={checkOutDate} rightColText={checkOutTime} isLabelBold isTextBold />
				<RatesRowItem label='Rate Name' leftColText={agreement?.rateName} isLabelBold isTextBold />
				<RatesRowItem
					label='Hourly'
					leftColText={<>{agreement?.hourlyQty}&nbsp;x</>}
					rightColNum={agreement?.hourlyRate}
				/>
				<RatesRowItem
					label='Daily'
					leftColText={<>{agreement?.dailyQty}&nbsp;x</>}
					rightColNum={agreement?.dailyRate}
				/>
				<RatesRowItem
					label='Weekly'
					leftColText={<>{agreement?.weeklyQty}&nbsp;x</>}
					rightColNum={agreement?.weeklyRate}
				/>
				<RatesRowItem
					label='Monthly'
					leftColText={<>{agreement?.monthlyQty}&nbsp;x</>}
					rightColNum={agreement?.monthlyRate}
				/>
			</Grid>
		</Panel>
	);
};

const RatesRowItem: React.FunctionComponent<{
	label: string | React.ReactNode;
	leftColText?: string | React.ReactNode | undefined;
	rightColText?: string | number | React.ReactNode | undefined;
	rightColNum?: number | null | undefined;
	isLabelBold?: true;
	isTextBold?: true;
}> = React.memo(({ label, leftColText, rightColText, rightColNum, isLabelBold, isTextBold }) => {
	return (
		<Row style={{ marginBottom: 5 }}>
			<Col xs={24} md={12} style={{ fontWeight: isLabelBold ? 900 : 500 }}>
				{label}
			</Col>
			<Col xs={12} md={6} style={{ fontWeight: isLabelBold ? 900 : 500 }}>
				{leftColText ? leftColText : <>&nbsp;</>}
			</Col>
			{rightColText && (
				<Col xs={12} md={6} style={{ fontWeight: isTextBold ? 900 : 500 }}>
					{rightColText && rightColText}
				</Col>
			)}
			{rightColNum && (
				<Col xs={12} md={6} style={{ fontWeight: isTextBold ? 900 : 500 }}>
					{rightColNum.toFixed(2)}
				</Col>
			)}
		</Row>
	);
});

export default React.memo(RatesPanel);
