import React from "react";
import { Panel, Nav } from "rsuite";

import RatesPanel from "./RatesPanel";
import DriversPanel from "./DriversPanel";
import OthersInformationPanel from "./OthersInformationPanel";

const OtherAgreementSummary: React.FunctionComponent = () => {
	const [key, setKey] = React.useState("rates");

	const handleSelect = (keyItem: string) => setKey(keyItem);
	return (
		<Panel header='Other Information' bordered>
			<Nav appearance='subtle' activeKey={key} onSelect={handleSelect}>
				<Nav.Item eventKey='rates'>Rates</Nav.Item>
				<Nav.Item eventKey='driver'>Driver</Nav.Item>
				<Nav.Item eventKey='others'>Others</Nav.Item>
			</Nav>
			{key === "driver" && <DriversPanel />}
			{key === "rates" && <RatesPanel />}
			{key === "others" && <OthersInformationPanel />}
		</Panel>
	);
};

export default React.memo(OtherAgreementSummary);
