import React from "react";
import { Modal, Button, Alert } from "rsuite";

import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, selectAuthUserState } from "../../redux/store";

import { ALERT_DURATION } from "../../utils/APP_CONSTANTS";
import { loginUserThunk } from "../../redux/thunks/authUserThunks";

const AuthModal: React.FunctionComponent = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { isLoggedIn, isAuthenticating, error: loginError } = useSelector(selectAuthUserState);

	React.useEffect(() => {
		if (loginError) Alert.error(loginError, ALERT_DURATION);
	}, [loginError]);

	const handleAuth = React.useCallback(async () => {
		dispatch(loginUserThunk());
	}, [dispatch]);

	return (
		<Modal show={!isLoggedIn} size='xs'>
			<Modal.Header closeButton={false}>
				<b>Authentication Required!</b>
			</Modal.Header>
			<Modal.Body>
				<p style={{ marginBottom: 20 }}>You must be authenticated to use this app!</p>
			</Modal.Body>
			<Modal.Footer>
				<Button appearance='primary' className='background-primary' onClick={handleAuth} loading={isAuthenticating}>
					AUTHENTICATE
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default AuthModal;
