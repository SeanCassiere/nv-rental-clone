import React from "react";

import DNDGrid from "./DNDGrid";
import AppPageContainer from "../../shared/components/AppPageContainer";

const DashboardPage: React.FunctionComponent = () => {
	return (
		<AppPageContainer>
			<p>Dashboard page</p>
			<div>
				<DNDGrid />
			</div>
		</AppPageContainer>
	);
};

export default DashboardPage;
