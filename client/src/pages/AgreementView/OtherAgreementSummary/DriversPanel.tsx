import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Panel, Grid, Row, Col, Icon, Placeholder } from "rsuite";
import { useSelector } from "react-redux";
import { selectViewAgreementState } from "../../../redux/store";

const DriversPanel: React.FunctionComponent = () => {
	const { agreement, isSearching } = useSelector(selectViewAgreementState);

	if (isSearching)
		return (
			<Panel style={{ marginTop: 15 }} bordered>
				<Placeholder.Grid rows={1} columns={3} rowHeight={40} />
			</Panel>
		);

	return (
		<Panel style={{ marginTop: 15 }} bodyFill>
			<PerDriverItem
				name={
					<RouterLink to={`/customers/${agreement?.customerId}`}>
						{agreement?.firstName}&nbsp;{agreement?.lastName}
					</RouterLink>
				}
				licenseNumber={agreement?.customerLicenseNumber}
				isMain
			/>
		</Panel>
	);
};

const PerDriverItem: React.FunctionComponent<{
	name: string | React.ReactNode;
	licenseNumber: string | React.ReactNode;
	isMain?: true;
}> = React.memo(({ name, licenseNumber, isMain }) => {
	return (
		<Panel style={{ marginBottom: 5 }} bordered>
			<Grid fluid>
				<Row>
					<Col xsHidden md={4}>
						<Icon icon={isMain ? "dot-circle-o" : "circle-o"} />
					</Col>
					<Col xs={20}>
						<Row>
							<Col xs={24} md={12}>
								{name}
							</Col>
							<Col xs={24} md={12}>
								{licenseNumber}
							</Col>
						</Row>
					</Col>
				</Row>
			</Grid>
		</Panel>
	);
});

export default React.memo(DriversPanel);
