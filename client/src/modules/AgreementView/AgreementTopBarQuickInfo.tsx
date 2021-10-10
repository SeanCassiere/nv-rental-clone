import React from "react";
import { Grid, Row, Col, Icon } from "rsuite";
import { useSelector } from "react-redux";

import { selectAppKeyValuesState, selectViewAgreementState } from "../../shared/redux/store";

import PillTopBarItem from "../../shared/components/PillTopBarItem";

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
				<Col sm={12} md={12} lg={6}>
					<PillTopBarItem keyLabel='No.' valueLabel={agreement?.agreementNumber} isSearching={isSearching} />
				</Col>
				<Col sm={12} md={12} lg={6}>
					<PillTopBarItem
						keyLabel={<Icon icon='user' />}
						valueLabel={`${agreement?.firstName} ${agreement?.lastName}`}
						isSearching={isSearching}
					/>
				</Col>
				<Col sm={12} md={12} lg={6}>
					<PillTopBarItem keyLabel={<Icon icon='home' />} valueLabel={agreement?.hPhone} isSearching={isSearching} />
				</Col>
				<Col sm={12} md={12} lg={6}>
					<PillTopBarItem keyLabel='Status' valueLabel={statusLabel} isSearching={isSearching} />
				</Col>
			</Row>
		</Grid>
	);
};

export default React.memo(TopBarQuickInfo);
