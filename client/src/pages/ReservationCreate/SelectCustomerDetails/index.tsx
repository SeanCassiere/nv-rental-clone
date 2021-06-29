import React from "react";
import { FlexboxGrid, Panel } from "rsuite";

const SelectCustomerDetails = () => {
	return (
		<FlexboxGrid>
			<FlexboxGrid.Item colspan={24}>
				<Panel header='Select Customer' bordered></Panel>
			</FlexboxGrid.Item>
		</FlexboxGrid>
	);
};

export default React.memo(SelectCustomerDetails);
