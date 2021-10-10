import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Panel, Grid, Row, Col, Placeholder } from "rsuite";
import Moment from "react-moment";
import { useSelector } from "react-redux";

import { selectAppConfigState, selectViewAgreementState } from "../../shared/redux/store";
import styled from "styled-components";

const AgreementInformation = () => {
	const { agreement, isSearching } = useSelector(selectViewAgreementState);
	const { dates } = useSelector(selectAppConfigState);

	if (isSearching)
		return (
			<Panel header='Agreement Information' style={{ marginBottom: 10 }} bordered>
				<Placeholder.Grid rows={13} columns={2} />
			</Panel>
		);
	return (
		<Panel header='Agreement Information' bordered style={{ marginBottom: 10 }}>
			<Grid fluid>
				<RowItem
					label='Vehicle'
					text={
						<>
							{agreement?.vehicleMakeName}&nbsp;{agreement?.modelName}&nbsp;{agreement?.year}
						</>
					}
				/>
				<RowItem
					label='Vehicle No.'
					text={<RouterLink to={`/vehicles/${agreement?.vehicleId}`}>{agreement?.vehicleNo}</RouterLink>}
				/>
				<RowItem label='Type' text={agreement?.vehicleType} />
				<RowItem label='License No.' text={agreement?.licenseNo} />
				<RowItem label='Check-Out Location' text={agreement?.checkoutLocationName} />
				<RowItem
					label={<>Check-Out Date &amp; Time</>}
					text={<Moment format={dates.dateTimeLong}>{agreement?.checkoutDate}</Moment>}
				/>
				<RowItem label='Check-In Location' text={agreement?.returnLocationName} />
				<RowItem
					label={<>Check-In Date &amp; Time</>}
					text={<Moment format={dates.dateTimeLong}>{agreement?.checkinDate}</Moment>}
				/>
				<RowItem label='Check-Out Mileage' text={agreement?.odometerOut} />
				<RowItem label='Fuel Out' text={agreement?.fuelLevelOut} />
				<RowItem label='Created By' text={agreement?.createdByName} />
				<RowItem label='Last Updated By' text={agreement?.lastUpdatedBy} />
				<RowItem label='Checked In By' text={agreement?.checkedInByName} />
			</Grid>
		</Panel>
	);
};

const RowItem: React.FunctionComponent<{
	label: string | React.ReactNode;
	text: string | React.ReactNode;
}> = React.memo(({ label, text }) => {
	return (
		<Row>
			<Col componentClass={ColItem} md={12}>
				<b>{label}</b>
			</Col>
			<Col componentClass={ColItem} md={12}>
				{text ? text : <></>}
			</Col>
		</Row>
	);
});

export default React.memo(AgreementInformation);

const ColItem = styled.div`
	margin-bottom: 10px;
`;
