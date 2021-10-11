import React from "react";
import { FlexboxGrid, Steps, Grid, Row, Col, Panel } from "rsuite";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, selectCreateReservationState } from "../../shared/redux/store";
import AppPageContainer from "../../shared/components/AppPageContainer";
import {
	clearCreateReservationState,
	setJumpCreateResNavPosition,
} from "../../shared/redux/slices/createReservationSlice";

import CreateReservationChargesSummary from "./CreateReservationChargesSummary";
import SelectReservationDetails from "./SelectReservationDetails";
import SelectCustomerDetails from "./SelectCustomerDetails";
import SelectVehicleDetails from "./SelectVehicleDetails";
import SelectMisChargeDetails from "./SelectMisChargeDetails";

const ReservationCreateScreen = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { currentNavPosition } = useSelector(selectCreateReservationState);

	React.useEffect(() => {
		return () => {
			dispatch(clearCreateReservationState());
		};
	}, [dispatch]);

	return (
		<AppPageContainer>
			<Grid>
				<Row style={{ marginBottom: 20 }}>
					<Col sm={24}>
						<Panel header='Create Reservation' bordered></Panel>
					</Col>
				</Row>
				<Row>
					<Col sm={24}>
						<FlexboxGrid align='top' justify='center'>
							<FlexboxGrid.Item as={Col} md={4}>
								<Steps current={currentNavPosition} style={{ marginTop: 80, marginBottom: 50 }} vertical>
									<Steps.Item title='Details' onClick={() => dispatch(setJumpCreateResNavPosition("detail"))} />
									<Steps.Item
										title='Customer'
										onClick={() => {
											if (currentNavPosition >= 1) dispatch(setJumpCreateResNavPosition("customer"));
										}}
									/>
									<Steps.Item
										title='Vehicle'
										onClick={() => {
											if (currentNavPosition >= 2) dispatch(setJumpCreateResNavPosition("vehicle"));
										}}
									/>
									<Steps.Item
										title='Miscellaneous Charges'
										onClick={() => {
											if (currentNavPosition >= 3) dispatch(setJumpCreateResNavPosition("misCharge"));
										}}
									/>
								</Steps>
							</FlexboxGrid.Item>
							<FlexboxGrid.Item
								as={Col}
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
							<FlexboxGrid.Item as={Col} xs={24} sm={24} md={9}>
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
