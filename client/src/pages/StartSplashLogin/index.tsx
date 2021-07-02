import React from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
	Container,
	FlexboxGrid,
	Content,
	Panel,
	Form,
	FormGroup,
	ControlLabel,
	FormControl,
	ButtonToolbar,
	Button,
	Col,
	Alert,
} from "rsuite";

import { AppDispatch, selectAuthUserState } from "../../redux/store";
import { loginUserThunk } from "../../redux/thunks/authUserThunks";

const StartSplashLoginPage: React.FunctionComponent = () => {
	const dispatch = useDispatch<AppDispatch>();
	const history = useHistory();
	const { isLoggedIn } = useSelector(selectAuthUserState);

	const [localUserName, setLocalUserName] = React.useState("");
	const [localPassword, setLocalPassword] = React.useState("");

	React.useEffect(() => {
		if (isLoggedIn) history.push("/dashboard");
	}, [isLoggedIn, history]);

	const handleLoginRequest = React.useCallback(() => {
		if (localUserName === "" || localPassword === "")
			Alert.warning("Login fields for username or password fields cannot be empty", 5000);

		dispatch(loginUserThunk({ username: localUserName, password: localPassword }));
	}, [localUserName, localPassword, dispatch]);

	return (
		<Container>
			<Content>
				<FlexboxGrid justify='center' align='middle' style={{ minHeight: 700 }}>
					<FlexboxGrid.Item componentClass={Col} xs={20} sm={12} md={8}>
						<Panel header={<h3>Login</h3>} bordered>
							<Form fluid>
								<FormGroup>
									<ControlLabel>Username</ControlLabel>
									<FormControl name='name' value={localUserName} onChange={(e) => setLocalUserName(e)} />
								</FormGroup>
								<FormGroup>
									<ControlLabel>Password</ControlLabel>
									<FormControl
										name='password'
										type='password'
										value={localPassword}
										onChange={(e) => setLocalPassword(e)}
									/>
								</FormGroup>
								<FormGroup>
									<ButtonToolbar>
										<Button appearance='primary' onClick={handleLoginRequest}>
											Sign in
										</Button>
										<Button appearance='link' onClick={() => console.log("Trying to reset password")}>
											Forgot password?
										</Button>
									</ButtonToolbar>
								</FormGroup>
							</Form>
						</Panel>
					</FlexboxGrid.Item>
				</FlexboxGrid>
			</Content>
		</Container>
	);
};

export default StartSplashLoginPage;
