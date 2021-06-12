import React from "react";
import "./App.css";

import { ThemeSwitcherProvider } from "react-css-theme-switcher";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, selectAppConfigState, selectAuthUserState } from "./redux/store";

import { Alert } from "rsuite";

import DashboardPage from "./pages/Dashboard";
import AgreementSearchPage from "./pages/AgreementSearch";
import ReservationSearchPage from "./pages/ReservationSearch";
import CustomerSearchPage from "./pages/CustomerSearch";
import VehicleSearchPage from "./pages/VehicleSearch";
import AgreementViewPage from "./pages/AgreementView";
import AdminSettingsPage from "./pages/Admin";

import StartSplashPage from "./pages/StartSplash";

import NotFoundPage from "./pages/NotFound";
import { refreshAuthTokenThunk } from "./redux/thunks/authUserThunks";

const themes = { light: "/styles/rsuite-default.css", dark: "/styles/rsuite-dark.min.css" };

const App: React.FunctionComponent = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { isLoggedIn, tokenExpiresAt, error: loginError, token, refreshToken } = useSelector(selectAuthUserState);
	const { theme } = useSelector(selectAppConfigState);

	React.useEffect(() => {
		if (!isLoggedIn || !tokenExpiresAt) return;
		if (token === "" || refreshToken === "") return;

		const expiryTime = tokenExpiresAt - Math.round(Date.now() / 1000);

		const refreshInterval = setInterval(async () => {
			// Refresh the access token 60 secs before the Navotar token expires
			dispatch(refreshAuthTokenThunk());
		}, expiryTime * 1000 - 60);

		return () => clearInterval(refreshInterval);
	}, [isLoggedIn, tokenExpiresAt, dispatch, token, refreshToken]);

	React.useEffect(() => {
		if (loginError) Alert.warning(loginError, 120000);
	}, [loginError]);

	return (
		<ThemeSwitcherProvider themeMap={themes} defaultTheme={theme}>
			<Router>
				<Switch>
					<Route exact path='/' component={StartSplashPage} />
					<Route exact path='/dashboard' component={DashboardPage} />

					<Route exact path='/vehicles' component={VehicleSearchPage} />
					{/* <Route exact path='/vehicles/:id' component={DashboardPage} /> */}

					{/* <Route exact path='/gps' component={AgreementSearchPage} /> */}

					<Route exact path='/reservations' component={ReservationSearchPage} />
					{/* <Route exact path='/reservations/:id' component={DashboardPage} /> */}

					<Route exact path='/customers' component={CustomerSearchPage} />
					{/* <Route exact path='/customers/:id/edit' component={DashboardPage} /> */}

					<Route exact path='/agreements' component={AgreementSearchPage} />
					<Route exact path='/agreements/:id' component={AgreementViewPage} />
					{/* <Route exact path='/agreements/:id/edit' component={DashboardPage} /> */}
					{/* <Route exact path='/agreements/:id/checkin' component={DashboardPage} /> */}

					{/* <Route exact path='/claims' component={AgreementSearchPage} /> */}
					{/* <Route exact path='/reports' component={AgreementSearchPage} /> */}
					<Route exact path='/admin' component={AdminSettingsPage} />
					<Route component={NotFoundPage} />
				</Switch>
			</Router>
		</ThemeSwitcherProvider>
	);
};

export default App;
