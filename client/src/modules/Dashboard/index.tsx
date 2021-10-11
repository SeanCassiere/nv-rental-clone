import React from "react";

import DNDGrid from "./DNDGrid";
import AppPageContainer from "../../shared/components/AppPageContainer";
import { Panel } from "rsuite";
import ViewPageHeader from "../../shared/components/ViewPageHeader";

const DashboardPage: React.FunctionComponent = () => {
	return (
		<AppPageContainer>
			<div style={{ padding: 5 }}>
				<Panel header={<ViewPageHeader title='Dashboard' />} bordered style={{ marginBottom: 10 }} defaultExpanded>
					<div>Dash</div>
					<br />
				</Panel>
			</div>
			<DNDGrid />
		</AppPageContainer>
	);
};

export default DashboardPage;
