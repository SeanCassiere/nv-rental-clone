import React from "react";
import "./App.css";
import "rsuite/dist/styles/rsuite-default.css";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectAuthUserState } from "./redux/store";
import { refreshAccessToken } from "./redux/slices/authUser";
import { refreshAuth } from "./api/authApi";

import { Alert } from "rsuite";

import DashboardPage from "./pages/Dashboard";
import AgreementSearchPage from "./pages/AgreementSearch";
import AdminSettingsPage from "./pages/Admin";

import StartSplashPage from "./pages/StartSplash";

import NotFoundPage from "./pages/NotFound";

const App: React.FunctionComponent = () => {
	const dispatch = useDispatch();
	const { isLoggedIn, tokenExpiresAt } = useSelector(selectAuthUserState);

	React.useEffect(() => {
		if (!isLoggedIn || !tokenExpiresAt) return;

		const expiryTime = tokenExpiresAt - Math.round(Date.now() / 1000);

		const refreshInterval = setInterval(async () => {
			try {
				const data = await refreshAuth();

				if (data.tokenExpiresAt === null) return;
				dispatch(refreshAccessToken({ token: data.token, tokenExpiresAt: data.tokenExpiresAt }));
			} catch (error) {
				Alert.warning(
					"There was an error refreshing your access token. You will be logged out in less that 1 minute.",
					12000
				);
			}
		}, expiryTime * 1000 - 60000);

		return () => clearInterval(refreshInterval);
	}, [isLoggedIn, tokenExpiresAt, dispatch]);

	return (
		<Router>
			<Switch>
				<Route exact path='/' component={StartSplashPage} />
				<Route exact path='/dashboard' component={DashboardPage} />
				<Route exact path='/vehicles' component={AgreementSearchPage} />
				<Route exact path='/gps' component={AgreementSearchPage} />
				<Route exact path='/reservations' component={AgreementSearchPage} />
				<Route exact path='/customers' component={AgreementSearchPage} />

				<Route exact path='/agreements' component={AgreementSearchPage} />
				<Route exact path='/agreements/:id' component={DashboardPage} />
				<Route exact path='/agreements/:id/edit' component={DashboardPage} />
				<Route exact path='/agreements/:id/checkin' component={DashboardPage} />

				<Route exact path='/claims' component={AgreementSearchPage} />
				<Route exact path='/reports' component={AgreementSearchPage} />
				<Route exact path='/admin' component={AdminSettingsPage} />
				<Route component={NotFoundPage} />
			</Switch>
		</Router>
	);
};

export default App;
