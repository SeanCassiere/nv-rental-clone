import React from "react";
import { FlexboxGrid, Steps, Grid, Row, Col, Panel } from "rsuite";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, selectCreateReservationState } from "../../redux/store";
import AppPageContainer from "../../components/AppPageContainer";
import { setCreateResNavPosition } from "../../redux/slices/createReservationSlice";

import CreateReservationChargesSummary from "./CreateReservationChargesSummary";
import SelectReservationDetails from "./SelectReservationDetails";
import SelectCustomerDetails from "./SelectCustomerDetails";
import SelectVehicleDetails from "./SelectVehicleDetails";
import SelectMisChargeDetails from "./SelectMisChargeDetails";

const ReservationCreateScreen = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { currentNavPosition } = useSelector(selectCreateReservationState);

	return (
		<AppPageContainer>
			<Grid fluid>
				<Row style={{ marginBottom: 20 }}>
					<Col>
						<Panel header='Create Reservation' bordered></Panel>
					</Col>
				</Row>
				<Row>
					<Col>
						<FlexboxGrid align='top' justify='center'>
							<FlexboxGrid.Item componentClass={Col} md={4}>
								<Steps current={currentNavPosition} style={{ marginTop: 80, marginBottom: 50 }} vertical>
									<Steps.Item title='Details' onClick={() => dispatch(setCreateResNavPosition(0))} />
									<Steps.Item
										title='Customer'
										onClick={() => {
											if (currentNavPosition >= 1) dispatch(setCreateResNavPosition(1));
										}}
									/>
									<Steps.Item
										title='Vehicle'
										onClick={() => {
											if (currentNavPosition >= 2) dispatch(setCreateResNavPosition(2));
										}}
									/>
									<Steps.Item
										title='Miscellaneous Charges'
										onClick={() => {
											if (currentNavPosition >= 3) dispatch(setCreateResNavPosition(3));
										}}
									/>
								</Steps>
							</FlexboxGrid.Item>
							<FlexboxGrid.Item
								componentClass={Col}
								xs={24}
								sm={24}
								md={10}
								style={{ padding: "0px 10px 20px 10px", minHeight: 400 }}
							>
								{currentNavPosition === 0 && <SelectReservationDetails />}
								{currentNavPosition === 1 && <SelectCustomerDetails />}
								{currentNavPosition === 2 && <SelectVehicleDetails />}
								{currentNavPosition === 3 && <SelectMisChargeDetails />}
							</FlexboxGrid.Item>
							<FlexboxGrid.Item componentClass={Col} xs={24} sm={24} md={9}>
								<CreateReservationChargesSummary />
							</FlexboxGrid.Item>
						</FlexboxGrid>
					</Col>
				</Row>
			</Grid>
		</AppPageContainer>
	);
};

export default ReservationCreateScreen;
