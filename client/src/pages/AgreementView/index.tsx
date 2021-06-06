import React from "react";
import { Grid, Col, Row, Panel, Button, Icon } from "rsuite";

import AppPageContainer from "../../components/AppPageContainer";
import AgreementInformation from "./AgreementInformation";
import AgreementChargesSummary from "./AgreementChargesSummary";

const AgreementViewPage = () => {
	return (
		<AppPageContainer>
			<Panel
				header={
					<h5>
						View Agreement&nbsp;
						<Button onClick={() => console.log("Clicked Refresh")}>
							<Icon icon='refresh' />
						</Button>
					</h5>
				}
				style={{ height: "100%" }}
				bordered
			>
				<Grid fluid>
					<Row>
						<Col md={7}>
							<AgreementInformation />
						</Col>
						<Col md={9}>
							<AgreementChargesSummary />
						</Col>
						<Col md={8}>
							<AgreementInformation />
						</Col>
					</Row>
				</Grid>
			</Panel>
		</AppPageContainer>
	);
};

export default AgreementViewPage;
