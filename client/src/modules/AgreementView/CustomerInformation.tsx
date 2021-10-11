import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Panel, Grid, Row, Col, Placeholder } from "rsuite";
import { useSelector } from "react-redux";
import { selectViewAgreementState } from "../../shared/redux/store";
import styled from "styled-components";

const CustomerInformation: React.FunctionComponent = () => {
	const { agreement, isSearching } = useSelector(selectViewAgreementState);

	if (isSearching)
		return (
			<Panel header='Customer Information' style={{ marginBottom: 10 }} bordered>
				<Placeholder.Grid rows={6} columns={2} />
			</Panel>
		);

	return (
		<Panel header='Customer Information' style={{ marginBottom: 10 }} bordered>
			<Grid fluid>
				<RowItem
					label='Full Name'
					text={
						<RouterLink to={`/customers/${agreement?.customerId}`}>
							{agreement?.firstName}&nbsp;{agreement?.lastName}
						</RouterLink>
					}
				/>
				<RowItem label='Home Phone' text={agreement?.hPhone} />
				<RowItem label='Work Phone' text={agreement?.bPhone} />
				<RowItem label='Mobile Phone' text={agreement?.cPhone} />
				<RowItem label='License No.' text={agreement?.customerLicenseNumber} />
				<RowItem label='Email' text={agreement?.email?.toLowerCase()} />
			</Grid>
		</Panel>
	);
};

const RowItem: React.FunctionComponent<{
	label: string | React.ReactNode;
	text: string | React.ReactNode;
}> = ({ label, text }) => {
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
};

export default React.memo(CustomerInformation);

const ColItem = styled.div`
	margin-bottom: 10px;
`;
