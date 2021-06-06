import React from "react";
import "./App.css";
import "rsuite/dist/styles/rsuite-default.css";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectAuthUserState } from "./redux/store";

import { Alert } from "rsuite";

import DashboardPage from "./pages/Dashboard";
import AgreementSearchPage from "./pages/AgreementSearch";
import AdminSettingsPage from "./pages/Admin";

import StartSplashPage from "./pages/StartSplash";

import NotFoundPage from "./pages/NotFound";
import { refreshAuthTokenThunk } from "./redux/slices/thunks/authUserThunks";

const App: React.FunctionComponent = () => {
	const dispatch = useDispatch();
	const { isLoggedIn, tokenExpiresAt, error: loginError } = useSelector(selectAuthUserState);

	React.useEffect(() => {
		if (!isLoggedIn || !tokenExpiresAt) return;

		const expiryTime = tokenExpiresAt - Math.round(Date.now() / 1000);

		const refreshInterval = setInterval(async () => {
			dispatch(refreshAuthTokenThunk());
		}, expiryTime * 1000 - 60000);

		return () => clearInterval(refreshInterval);
	}, [isLoggedIn, tokenExpiresAt, dispatch]);

	React.useEffect(() => {
		if (loginError) Alert.warning(loginError, 120000);
	}, [loginError]);

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
