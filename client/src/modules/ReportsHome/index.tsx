import React from "react";
import { useSelector } from "react-redux";
import { Panel } from "rsuite";

import AppPageContainer from "../../shared/components/AppPageContainer";
import ViewPageHeader from "../../shared/components/ViewPageHeader";

import { selectReportsState } from "../../shared/redux/store";
import DemoDisplayReportsTree from "./DemoDisplayReportsTree";

const ReportsHomePage: React.FunctionComponent = () => {
	const { reportsAvailable, reportFolders } = useSelector(selectReportsState);

	return (
		<AppPageContainer>
			<Panel bodyFill header={<ViewPageHeader title='Reports' />} style={{ height: "100%" }}>
				<DemoDisplayReportsTree folders={reportFolders} reports={reportsAvailable} />
			</Panel>
		</AppPageContainer>
	);
};

export default React.memo(ReportsHomePage);
