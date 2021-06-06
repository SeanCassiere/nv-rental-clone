import React from "react";
import { Panel, Grid, Row, Col, Placeholder } from "rsuite";
import { useSelector } from "react-redux";

import { selectViewAgreementState } from "../../redux/store";
import styled from "styled-components";

const AgreementInformation = () => {
	const { agreement, isSearching } = useSelector(selectViewAgreementState);

	const [checkInDate, setCheckInDate] = React.useState("");
	const [checkOutDate, setCheckOutDate] = React.useState("");

	React.useEffect(() => {
		if (!agreement) return;
		if (agreement.checkinDate) {
			const date = new Date(agreement.checkinDate);
			setCheckInDate(`${date.toLocaleDateString()} ${date.toLocaleTimeString()}`);
		}
		if (agreement.checkoutDate) {
			const date = new Date(agreement.checkoutDate);
			setCheckOutDate(`${date.toLocaleDateString()} ${date.toLocaleTimeString()}`);
		}
	}, [agreement]);

	return (
		<Panel header='Agreement Information' bordered style={{ marginBottom: 10 }}>
			<Grid fluid>
				<RowItem
					loading={isSearching}
					label='Vehicle'
					text={
						<>
							{agreement?.vehicleMakeName}&nbsp;{agreement?.modelName}&nbsp;{agreement?.year}
						</>
					}
				/>
				<RowItem loading={isSearching} label='Vehicle No.' text={`${agreement?.vehicleNo}`} />
				<RowItem loading={isSearching} label='Type' text={`${agreement?.vehicleType}`} />
				<RowItem loading={isSearching} label='License No.' text={`${agreement?.licenseNo}`} />
				<RowItem loading={isSearching} label='Check-Out Location' text={`${agreement?.checkoutLocationName}`} />
				<RowItem loading={isSearching} label={<>Check-Out Date &amp; Time</>} text={`${checkOutDate}`} />
				<RowItem loading={isSearching} label='Check-In Location' text={`${agreement?.returnLocationName}`} />
				<RowItem loading={isSearching} label={<>Check-In Date &amp; Time</>} text={`${checkInDate}`} />
				<RowItem loading={isSearching} label='Check-Out Mileage' text={`${agreement?.odometerOut}`} />
				<RowItem loading={isSearching} label='Fuel Out' text={`${agreement?.fuelLevelOut}`} />
				<RowItem loading={isSearching} label='Created By' text={`${agreement?.createdByName}`} />
				<RowItem loading={isSearching} label='Last Updated By' text={`${agreement?.lastUpdatedBy}`} />
				<RowItem loading={isSearching} label='Checked In By' text={`${agreement?.checkedInByName}`} />
			</Grid>
		</Panel>
	);
};

const RowItem: React.FunctionComponent<{
	label: string | React.ReactNode;
	text: string | React.ReactNode;
	loading: boolean;
}> = React.memo(({ label, text, loading }) => {
	if (loading) {
		return (
			<Row>
				<Col componentClass={ColItem} md={12}>
					<b>{label}</b>
				</Col>
				<Col componentClass={ColItem} md={12}>
					<Placeholder.Graph width={150} height={20} active />
				</Col>
			</Row>
		);
	}

	return (
		<Row>
			<Col componentClass={ColItem} md={12}>
				<b>{label}</b>
			</Col>
			<Col componentClass={ColItem} md={12}>
				{text}
			</Col>
		</Row>
	);
});

export default React.memo(AgreementInformation);

const ColItem = styled.div`
	margin-bottom: 10px;
`;
