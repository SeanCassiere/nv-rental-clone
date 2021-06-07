import React from "react";
import { Panel, Grid, Row, Col, Placeholder } from "rsuite";
import { useSelector } from "react-redux";
import { selectViewAgreementState } from "../../../redux/store";

const OthersInformationPanel: React.FunctionComponent = () => {
	const { agreement, isSearching } = useSelector(selectViewAgreementState);

	if (isSearching)
		return (
			<Panel style={{ marginTop: 15 }} bordered>
				<Placeholder.Grid rows={2} columns={1} />
			</Panel>
		);

	return (
		<Panel style={{ marginTop: 15 }} bordered>
			<Grid fluid>
				<Row>
					<Col xs={10}>PO</Col>
					<Col xs={14}>{agreement?.poNo}</Col>
				</Row>
				<Row>
					<Col xs={10}>RO</Col>
					<Col xs={14}>{agreement?.roNo}</Col>
				</Row>
			</Grid>
		</Panel>
	);
};

export default React.memo(OthersInformationPanel);
