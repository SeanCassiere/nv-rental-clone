import React from "react";

import { Panel, Grid, Col, Row } from "rsuite";

import AppPageContainer from "../../components/AppPageContainer";

const AdminSettingsPage: React.FunctionComponent = () => {
	return (
		<AppPageContainer>
			<Grid fluid>
				<Row>
					<Col xs={24} md={8}>
						<Panel header={<b>Application Configuration</b>} bordered style={{ marginTop: 10 }}>
							<p>Location</p>
							<p>Leasing Companies</p>
							<p>Insurance Companies</p>
							<p>Users</p>
							<p>Reset Password</p>
							<p>Permission Management</p>
							<p>Company Expense</p>
							<p>Global Documents</p>
							<p>Store Hours</p>
							<p>ID Configuration</p>
							<p>Compatibility Configuration</p>
							<p>Manage Email Templates</p>
							<p>Manage SMS Templates</p>
							<p>Surveys</p>
							<p>Cancellation Charges</p>
							<p>Terms &amp; Conditions</p>
							<p>Bulk Upload</p>
							<p>Logo</p>
							<p>Label Configuration</p>
						</Panel>
					</Col>
					<Col xs={24} md={8}>
						<Panel header={<b>Rates Configuration</b>} bordered style={{ marginTop: 10 }}>
							<p>Rental Rates</p>
							<p>Rental Rate Rules</p>
							<p>Seasonal Rates</p>
							<p>Taxes</p>
							<p>Miscellaneous Charge</p>
							<p>Deductible Miscellaneous Charge</p>
							<p>Reservation Module</p>
							<p>Drop off Charge</p>
							<p>Promotion</p>
							<p>Upload Traffic Ticket / Tolls</p>
							<p>Traffic Ticket Log</p>
							<p>Referral</p>
							<p>Referral Payment</p>
						</Panel>
					</Col>
					<Col xs={24} md={8}>
						<Panel header={<b>Vehicle Configuration</b>} bordered style={{ marginTop: 10 }}>
							<p>Types</p>
							<p>Makes</p>
							<p>Model</p>
							<p>Options</p>
							<p>Staff</p>
							<p>Vendor</p>
							<p>Maintenance Service Scheduler</p>
							<p>Damage Check List</p>
							<p>Column Customization</p>
							<p>Customer OTP Generation</p>
						</Panel>
						<Panel header={<b>GPS Configuration</b>} bordered style={{ marginTop: 10 }}>
							<p>Geo Fence</p>
						</Panel>
					</Col>
				</Row>
			</Grid>
		</AppPageContainer>
	);
};

export default AdminSettingsPage;
