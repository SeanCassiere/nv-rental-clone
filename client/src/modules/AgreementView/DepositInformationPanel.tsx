import React from "react";
import { Panel, Grid, Row, Col, Placeholder } from "rsuite";
import { useSelector } from "react-redux";
import { selectViewAgreementState } from "../../shared/redux/store";
import styled from "styled-components";

const DepositInformationPanel: React.FunctionComponent = () => {
	const { agreement, isSearching } = useSelector(selectViewAgreementState);

	if (isSearching)
		return (
			<Panel header='Deposit Information' style={{ marginBottom: 10 }} bordered>
				<Placeholder.Grid rows={2} columns={4} />
			</Panel>
		);

	return (
		<Panel header='Deposit Information' style={{ marginBottom: 10 }} bordered>
			<Grid fluid>
				<Row>
					<Col componentClass={ColItem} xs={16} md={6}>
						<b>Total Deposit</b>
					</Col>
					<Col componentClass={ColItemTextRight} xs={8} md={6}>
						${agreement?.depositTotals.depositAmount.toFixed(2)}
					</Col>
					<Col componentClass={ColItem} xs={16} md={6}>
						<b>Total Authorized</b>
					</Col>
					<Col componentClass={ColItemTextRight} xs={8} md={6}>
						${agreement?.depositTotals.onHoldAmount.toFixed(2)}
					</Col>
				</Row>
				<Row>
					<Col componentClass={ColItem} xs={16} md={6}>
						<b>Total Refund</b>
					</Col>
					<Col componentClass={ColItemTextRight} xs={8} md={6}>
						${agreement?.depositTotals.refundAmount.toFixed(2)}
					</Col>
					<Col componentClass={ColItem} xs={16} md={6}>
						<b>Total Released</b>
					</Col>
					<Col componentClass={ColItemTextRight} xs={8} md={6}>
						${agreement?.depositTotals.releaseAmount.toFixed(2)}
					</Col>
				</Row>
			</Grid>
		</Panel>
	);
};

export default React.memo(DepositInformationPanel);

const ColItem = styled.div`
	margin-bottom: 10px;
`;

const ColItemTextRight = styled.div`
	margin-bottom: 10px;
	text-align: right;
`;
