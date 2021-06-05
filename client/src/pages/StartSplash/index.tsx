import React from "react";

import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuthUserState } from "../../redux/store";

import AuthModal from "../../components/AuthModal";

const StartSplashPage: React.FunctionComponent = () => {
	const history = useHistory();
	const { isLoggedIn } = useSelector(selectAuthUserState);

	React.useEffect(() => {
		if (isLoggedIn) history.push("/dashboard");
	}, [isLoggedIn, history]);
	return <AuthModal />;
};

export default StartSplashPage;
