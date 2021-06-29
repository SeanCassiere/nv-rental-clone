import React from "react";
import { Panel, FlexboxGrid, Form, FormGroup, ControlLabel, SelectPicker, Grid, Row, Col, DatePicker } from "rsuite";

const selectOptions = [
	{
		label: "Online",
		value: "Online",
		role: "Master",
	},
	{
		label: "Phone",
		value: "Phone",
		role: "Master",
	},
];

const SelectReservationDetails = () => {
	return (
		<FlexboxGrid align='top'>
			<FlexboxGrid.Item colspan={24}>
				<Panel header='Reservation Information' bordered>
					<Form>
						<Grid fluid>
							<Row style={{ marginBottom: 20 }}>
								<FormGroup>
									<Col xs={12}>
										<ControlLabel>Reservation Type</ControlLabel>
									</Col>
									<Col xs={12}>
										<SelectPicker
											data={selectOptions}
											size='sm'
											searchable={false}
											cleanable={false}
											style={{ width: "100%" }}
										/>
									</Col>
								</FormGroup>
							</Row>
							<Panel bodyFill style={{ marginBottom: 20 }}>
								<Row style={{ marginBottom: 10 }}>
									<Col xs={12}>
										<FormGroup>
											<ControlLabel>Check-Out Date</ControlLabel>
											<DatePicker format='YYYY-MM-DD HH:mm A' showMeridian size='sm' block cleanable={false} />
										</FormGroup>
									</Col>
									<Col xs={12}>
										<FormGroup>
											<ControlLabel>Location</ControlLabel>
											<SelectPicker data={selectOptions} size='sm' cleanable={false} block />
										</FormGroup>
									</Col>
								</Row>
							</Panel>
							<Panel bodyFill>
								<Row style={{ marginBottom: 10 }}>
									<Col xs={12}>
										<FormGroup>
											<ControlLabel>Check-In Date</ControlLabel>
											<DatePicker format='YYYY-MM-DD HH:mm A' showMeridian size='sm' block cleanable={false} />
										</FormGroup>
									</Col>
									<Col xs={12}>
										<FormGroup>
											<ControlLabel>Location</ControlLabel>
											<SelectPicker data={selectOptions} size='sm' cleanable={false} block />
										</FormGroup>
									</Col>
								</Row>
							</Panel>
						</Grid>
					</Form>
				</Panel>
			</FlexboxGrid.Item>
		</FlexboxGrid>
	);
};

export default React.memo(SelectReservationDetails);
