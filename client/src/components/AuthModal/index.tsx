import React from "react";
import { Modal, Button, Alert } from "rsuite";

import { useSelector, useDispatch } from "react-redux";
import { selectAuthUserState } from "../../redux/store";
import { isAuth, logInUser } from "../../redux/slices/authUser";

import { performAuth } from "../../api/authApi";
import { ALERT_DURATION } from "../../utils/APP_CONSTANTS";

const AuthModal: React.FunctionComponent = () => {
	const dispatch = useDispatch();
	const { isLoggedIn, isAuthenticating } = useSelector(selectAuthUserState);

	const handleAuth = React.useCallback(async () => {
		dispatch(isAuth(true));
		try {
			const data = await performAuth();

			if (data.tokenExpiresAt === null) return;

			dispatch(
				logInUser({
					token: data.token,
					refreshToken: data.refreshToken,
					userId: data.userId,
					clientId: data.clientId,
					tokenExpiresAt: data.tokenExpiresAt,
				})
			);
		} catch (error) {
			dispatch(isAuth(false));
			Alert.error(`Auth failed. Reason: ${error.message}`, ALERT_DURATION);
		}
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
