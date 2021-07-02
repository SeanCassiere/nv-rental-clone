import React from "react";
import { Modal, Button, Grid, Row, Col, Icon } from "rsuite";

import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, selectAppConfigState, selectAuthUserState } from "../../redux/store";

import { loginUserThunk } from "../../redux/thunks/authUserThunks";
import { switchTheme } from "../../redux/slices/appConfigSlice";

const AuthModal: React.FunctionComponent = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { isLoggedIn, isAuthenticating } = useSelector(selectAuthUserState);
	const { theme } = useSelector(selectAppConfigState);

	const handleAuth = React.useCallback(async () => {
		dispatch(loginUserThunk({ username: "", password: "" }));
	}, [dispatch]);

	return (
		<Modal show={!isLoggedIn} size='xs'>
			<Modal.Header closeButton={false}>
				<Grid fluid>
					<Row>
						<Col xs={22}>
							<b>Authentication Required!</b>
						</Col>
						<Col xs={2}>
							<Button onClick={() => dispatch(switchTheme(theme))}>
								<Icon icon={theme === "light" ? "moon-o" : "sun-o"} />
							</Button>
						</Col>
					</Row>
				</Grid>
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
