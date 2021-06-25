import React from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Col, Row, Panel, Message } from "rsuite";

import AppPageContainer from "../../components/AppPageContainer";
import ViewPageHeader from "../../components/ViewPageHeader";
import ReservationTopBarQuickInfo from "./ReservationTopBarQuickInfo";
import ReservationInteractionButtonBar from "./ReservationInteractionButtonBar";

import { fetchReservationThunk } from "../../redux/thunks/viewReservationThunks";
import { AppDispatch, selectViewReservationState } from "../../redux/store";
import ReservationQuoteChargesSummary from "./ReservationQuoteChargesSummary";
import { clearViewReservationState } from "../../redux/slices/viewReservationSlice";

type PageParams = {
	id: string;
};

const AgreementViewPage: React.FunctionComponent = () => {
	const dispatch = useDispatch<AppDispatch>();
	const history = useHistory();
	const [refreshNow, setRefreshNow] = React.useState(1);

	const { isError, error: searchError } = useSelector(selectViewReservationState);
	const { id } = useParams<PageParams>();

	React.useEffect(() => {
		const promise = dispatch(fetchReservationThunk(id));

		return () => {
			promise.abort();
			dispatch(clearViewReservationState());
		};
	}, [id, dispatch, refreshNow]);

	const handleRefreshList = React.useCallback(() => {
		setRefreshNow((n) => n + 1);
	}, [setRefreshNow]);

	const handleGoBack = React.useCallback(() => {
		history.goBack();
	}, [history]);

	return (
		<AppPageContainer>
			<Panel
				bodyFill
				header={
					<ViewPageHeader
						title='View Reservation'
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
						<Col md={16}>
							<ReservationTopBarQuickInfo />
						</Col>
						<Col md={8}>
							<ReservationInteractionButtonBar />
						</Col>
					</Row>
					<Row>
						<Col md={8}>
							<></>
							<></>
						</Col>
						<Col md={8}>
							<></>
							<></>
						</Col>
						<Col md={8}>
							<ReservationQuoteChargesSummary />
						</Col>
					</Row>
				</Grid>
			</Panel>
		</AppPageContainer>
	);
};

export default React.memo(AgreementViewPage);
