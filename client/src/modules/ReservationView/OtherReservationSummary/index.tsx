import React from "react";
import { Panel, Nav } from "rsuite";

import CustomerInformationPanel from "./CustomerInformationPanel";
import DriversPanel from "./DriversPanel";
import OthersInformationPanel from "./OthersInformationPanel";
import BillingInformationPanel from "./BillingInformationPanel";

const OtherAgreementSummary: React.FunctionComponent = () => {
	const [key, setKey] = React.useState("customer");

	const handleSelect = (keyItem: string) => setKey(keyItem);
	return (
		<Panel bordered style={{ marginBottom: 10 }}>
			<Nav appearance='subtle' activeKey={key} onSelect={handleSelect}>
				<Nav.Item eventKey='customer'>Customer</Nav.Item>
				<Nav.Item eventKey='driver'>Driver</Nav.Item>
				<Nav.Item eventKey='billing'>Billing</Nav.Item>
				<Nav.Item eventKey='others'>Others</Nav.Item>
			</Nav>
			{key === "customer" && <CustomerInformationPanel />}
			{key === "driver" && <DriversPanel />}
			{key === "billing" && <BillingInformationPanel />}
			{key === "others" && <OthersInformationPanel />}
		</Panel>
	);
};

export default React.memo(OtherAgreementSummary);
