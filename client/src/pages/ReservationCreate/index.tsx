import React from "react";
import { FlexboxGrid, Steps, Col } from "rsuite";

import AppPageContainer from "../../components/AppPageContainer";

import CreateReservationChargesSummary from "./CreateReservationChargesSummary";
// import SelectReservationDetails from "./SelectReservationDetails";
import SelectCustomerDetails from "./SelectCustomerDetails";

const ReservationCreateScreen = () => {
	return (
		<AppPageContainer>
			<FlexboxGrid align='middle' justify='center' style={{ minHeight: "100%" }}>
				<FlexboxGrid.Item componentClass={Col} md={4}>
					<Steps current={0} vertical>
						<Steps.Item title='Details' />
						<Steps.Item title='Customer' />
						<Steps.Item title='Vehicle' />
						<Steps.Item title='Charges' />
					</Steps>
				</FlexboxGrid.Item>
				<FlexboxGrid.Item componentClass={Col} xs={24} sm={24} md={10} style={{ padding: "20px 10px" }}>
					{/* <SelectReservationDetails /> */}
					<SelectCustomerDetails />
				</FlexboxGrid.Item>
				<FlexboxGrid.Item componentClass={Col} xs={24} sm={24} md={9}>
					<CreateReservationChargesSummary />
				</FlexboxGrid.Item>
			</FlexboxGrid>
		</AppPageContainer>
	);
};

export default ReservationCreateScreen;
