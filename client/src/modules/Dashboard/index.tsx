import React from "react";
import { Panel } from "rsuite";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, selectAuthUserState } from "../../shared/redux/store";

import { fetchWidgetsList } from "../../shared/redux/thunks/allProcessesThunks/fetchWidgetsList";

import BeautifulDNDGrid from "./BeautifulDNDGrid";
import AppPageContainer from "../../shared/components/AppPageContainer";
import ViewPageHeader from "../../shared/components/ViewPageHeader";

const DashboardPage: React.FunctionComponent = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { clientId, userId } = useSelector(selectAuthUserState);

	const makeApiCall = React.useCallback(() => dispatch(fetchWidgetsList()), [dispatch]);

	React.useEffect(() => {
		if (!clientId || !userId) return;

		const promise = makeApiCall();

		return () => promise.abort();
	}, [dispatch, clientId, userId, makeApiCall]);

	return (
		<AppPageContainer>
			<div style={{ padding: 5 }}>
				<Panel header={<ViewPageHeader title='Dashboard' />} bordered style={{ marginBottom: 10 }} defaultExpanded>
					<div>Dash</div>
					<br />
				</Panel>
			</div>
			<BeautifulDNDGrid />
		</AppPageContainer>
	);
};

export default DashboardPage;
