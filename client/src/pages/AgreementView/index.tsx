import React from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Col, Row, Panel, Message } from "rsuite";

import AppPageContainer from "../../components/AppPageContainer";
import ViewPageHeader from "../../components/ViewPageHeader";

import AgreementInformation from "./AgreementInformation";
import AgreementChargesSummary from "./AgreementChargesSummary";
import CustomerInformation from "./CustomerInformation";
import OtherAgreementSummary from "./OtherAgreementSummary";
import DepositInformationPanel from "./DepositInformationPanel";

import { fetchAgreementThunk } from "../../redux/thunks/viewAgreementThunks";
import { AppDispatch, selectViewAgreementState } from "../../redux/store";
import { clearViewAgreementState } from "../../redux/slices/viewAgreementSlice";

type PageParams = {
	id: string;
};

const AgreementViewPage: React.FunctionComponent = () => {
	const dispatch = useDispatch<AppDispatch>();
	const history = useHistory();
	const [refreshNow, setRefreshNow] = React.useState(1);

	const { isError, error: searchError } = useSelector(selectViewAgreementState);
	const { id } = useParams<PageParams>();

	React.useEffect(() => {
		const promise = dispatch(fetchAgreementThunk(id));

		return () => {
			promise.abort();
			dispatch(clearViewAgreementState());
		};
	}, [id, dispatch, refreshNow]);

	const handleRefreshList = React.useCallback(() => {
		setRefreshNow((n) => n + 1);
	}, [setRefreshNow]);

	const handleGoBack = React.useCallback(() => {
		history.push("/agreements");
	}, [history]);

	return (
		<AppPageContainer>
			<Panel
				bodyFill
				header={
					<ViewPageHeader
						title='View Agreement'
						goBackFunction={handleGoBack}
						refreshFunction={handleRefreshList}
						refresh
						back
					/>
				}
				style={{ height: "100%" }}
			>
				{isError && (
					<Message type='error' title='An error occurred' description={searchError} style={{ marginBottom: 10 }} />
				)}
				<Grid fluid>
					<Row>
						<Col md={8}>
							<AgreementInformation />
							<CustomerInformation />
						</Col>
						<Col md={8}>
							<AgreementChargesSummary />
							<DepositInformationPanel />
						</Col>
						<Col md={8}>
							<OtherAgreementSummary />
						</Col>
					</Row>
				</Grid>
			</Panel>
		</AppPageContainer>
	);
};

export default React.memo(AgreementViewPage);
