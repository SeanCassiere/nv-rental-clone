import { useSelector } from "react-redux";
import { Route, RouteProps, Redirect } from "react-router-dom";

import { selectAuthUserState } from "../../redux/store";

export const AuthRoute = (routeProps: RouteProps) => {
	const { isLoggedIn } = useSelector(selectAuthUserState);
	if (!isLoggedIn) {
		return (
			<>
				<Redirect
					to={{
						pathname: "/login",
						state: { next: `${routeProps?.location?.pathname}${routeProps?.location?.search}` },
					}}
				/>
				{/* {console.log(`${routeProps?.location?.pathname}${routeProps?.location?.search}`)} */}
			</>
		);
	}

	return <Route {...routeProps} />;
};
