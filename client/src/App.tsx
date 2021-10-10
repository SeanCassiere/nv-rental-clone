import React from "react";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, selectAppConfigState, selectAuthUserState } from "./shared/redux/store";

import DashboardPage from "./modules/Dashboard";
import AgreementSearchPage from "./modules/AgreementSearch";
import ReservationSearchPage from "./modules/ReservationSearch";
import CustomerSearchPage from "./modules/CustomerSearch";
import VehicleSearchPage from "./modules/VehicleSearch";
import AgreementViewPage from "./modules/AgreementView";
import ReservationViewPage from "./modules/ReservationView";
import AdminSettingsPage from "./modules/Admin";
import ReservationCreateScreen from "./modules/ReservationCreate";

import StartSplashLoginPage from "./modules/StartSplashLogin";

import NotFoundPage from "./modules/NotFound";
import { fetchAuthUserPermissions, refreshAuthTokenThunk } from "./shared/redux/thunks/authUserThunks";
import {
	fetchAgreementKeyValuesThunk,
	fetchReservationKeyValuesThunk,
	fetchVehicleKeyValuesThunk,
} from "./shared/redux/thunks/appKeyValuesThunks";
import { fetchClientFeaturesThunk } from "./shared/redux/thunks/appConfigThunks";

const themes = { light: "/styles/index.css", dark: "/styles/rsuite-dark.min.css" };

const App: React.FunctionComponent = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { isLoggedIn, tokenExpiresAt, token, refreshToken } = useSelector(selectAuthUserState);
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
		if (!isLoggedIn || token === "") return;

		(async () => {
			await dispatch(fetchClientFeaturesThunk());

			dispatch(fetchAuthUserPermissions());
			dispatch(fetchReservationKeyValuesThunk());
			dispatch(fetchAgreementKeyValuesThunk());
			dispatch(fetchVehicleKeyValuesThunk());
		})();
	}, [dispatch, isLoggedIn, token]);

	return (
		<ThemeSwitcherProvider themeMap={themes} defaultTheme={theme}>
			<Router>
				<Switch>
					<Route exact path='/' component={StartSplashLoginPage} />
					<Route exact path='/dashboard' component={DashboardPage} />

					<Route exact path='/vehicles' component={VehicleSearchPage} />
					{/* <Route exact path='/vehicles/:id' component={DashboardPage} /> */}

					{/* <Route exact path='/gps' component={AgreementSearchPage} /> */}

					<Route exact path='/reservations' component={ReservationSearchPage} />
					<Route exact path='/reservations/create' component={ReservationCreateScreen} />
					<Route exact path='/reservations/:id' component={ReservationViewPage} />

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
