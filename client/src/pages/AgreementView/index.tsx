import React from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Col, Row, Panel, Button, Icon, Alert } from "rsuite";

import AppPageContainer from "../../components/AppPageContainer";
import AgreementInformation from "./AgreementInformation";
import AgreementChargesSummary from "./AgreementChargesSummary";
import { fetchAgreementThunk } from "../../redux/slices/thunks/viewAgreementThunks";
import { selectAuthUserState, selectViewAgreementState } from "../../redux/store";
import { refreshAgreementSummary } from "../../redux/slices/viewAgreement";
import { ALERT_DURATION } from "../../utils/APP_CONSTANTS";

type PageParams = {
	id: string;
};

const AgreementViewPage = () => {
	const dispatch = useDispatch();
	const history = useHistory();

	const { clientId, userId } = useSelector(selectAuthUserState);
	const { lastRanSearch, isError, error: searchError } = useSelector(selectViewAgreementState);
	const { id } = useParams<PageParams>();

	React.useEffect(() => {
		const currentTime = Math.floor(Date.now());
		const lastSearch = lastRanSearch ? Math.floor(Date.parse(lastRanSearch) + 15000) : Math.floor(Date.now());

		// Skip searching if already search in the last 30 secs
		if (lastSearch > currentTime) return;

		if (!clientId || !userId) return;

		dispatch(fetchAgreementThunk(id));
	}, [id, dispatch, lastRanSearch, clientId, userId]);

	React.useEffect(() => {
		if (isError) Alert.error(searchError, ALERT_DURATION);
	}, [isError, searchError]);

	const handleRefreshList = React.useCallback(() => {
		const currentTime = new Date();
		currentTime.setDate(currentTime.getDate() - 120);
		dispatch(refreshAgreementSummary(currentTime.toUTCString()));
	}, [dispatch]);

	const handleGoBack = React.useCallback(() => {
		history.goBack();
	}, [history]);

	return (
		<AppPageContainer>
			<Panel
				header={
					<h5>
						<Button onClick={handleGoBack}>
							<Icon icon='chevron-left' />
						</Button>
						&nbsp;View Agreement&nbsp;
						<Button onClick={handleRefreshList}>
							<Icon icon='refresh' />
						</Button>
					</h5>
				}
				style={{ height: "100%" }}
				bordered
			>
				<Grid fluid>
					<Row>
						<Col md={7}>
							<AgreementInformation />
						</Col>
						<Col md={9}>
							<AgreementChargesSummary />
						</Col>
						<Col md={8}>
							<AgreementInformation />
						</Col>
					</Row>
				</Grid>
			</Panel>
		</AppPageContainer>
	);
};

export default AgreementViewPage;
