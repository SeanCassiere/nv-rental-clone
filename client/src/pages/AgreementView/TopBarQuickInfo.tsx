import React from "react";
import { Grid, Row, Col, Icon } from "rsuite";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { selectAppKeyValuesState, selectViewAgreementState } from "../../redux/store";

const TopBarQuickInfo = () => {
	const [statusLabel, setStatusLabel] = React.useState("");
	const { agreement, isSearching } = useSelector(selectViewAgreementState);
	const {
		agreementValues: { agreementStatuses },
	} = useSelector(selectAppKeyValuesState);

	React.useEffect(() => {
		if (isSearching) return;

		const arrayed = agreementStatuses.filter((stat) => stat.id === agreement?.status);

		if (!arrayed) return;

		setStatusLabel(arrayed[0]?.name);
	}, [agreementStatuses, agreement, isSearching]);
	return (
		<Grid style={{ marginBottom: 10 }} fluid>
			<Row>
				<Col sm={5}>
					<PillItem keyLabel='No.' valueLabel={agreement?.agreementNumber} />
				</Col>
				<Col sm={6}>
					<PillItem keyLabel={<Icon icon='user' />} valueLabel={`${agreement?.firstName} ${agreement?.lastName}`} />
				</Col>
				<Col sm={6}>
					<PillItem keyLabel={<Icon icon='home' />} valueLabel={agreement?.hPhone} />
				</Col>
				<Col sm={6}>
					<PillItem keyLabel='Status' valueLabel={statusLabel} />
				</Col>
			</Row>
		</Grid>
	);
};

const PillItem = React.memo(({ keyLabel, valueLabel }: { keyLabel: React.ReactNode; valueLabel: React.ReactNode }) => {
	const { isSearching } = useSelector(selectViewAgreementState);

	return (
		<PillContainer>
			<span className='label'>{keyLabel}</span>
			<span className='value'>{isSearching ? "Loading..." : valueLabel}</span>
		</PillContainer>
	);
});

const PillContainer = styled.div`
	display: flex;
	width: 100%;
	margin-bottom: 5px;

	.label {
		min-width: 65px;
		text-align: center;
		height: 100%;
		padding: 5px 10px;
		display: inline-block;
		background-color: var(--primary-color);
		color: white;
		border: 1px solid var(--primary-color);
		border-top-left-radius: 5px;
		border-bottom-left-radius: 5px;
	}

	.value {
		flex-grow: 1;
		height: 100%;
		display: inline-block;
		padding: 5px 10px;
		border: 1px solid var(--primary-color);
		border-top-right-radius: 5px;
		border-bottom-right-radius: 5px;
	}
`;

export default TopBarQuickInfo;
