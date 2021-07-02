import React from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
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
} from "rsuite";

import { selectAuthUserState } from "../../redux/store";

const StartSplashLoginPage: React.FunctionComponent = () => {
	const [localUserName, setLocalUserName] = React.useState("");
	const [localPassword, setLocalPassword] = React.useState("");
	const history = useHistory();
	const { isLoggedIn } = useSelector(selectAuthUserState);

	React.useEffect(() => {
		if (isLoggedIn) history.push("/dashboard");
	}, [isLoggedIn, history]);
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
										<Button appearance='primary'>Sign in</Button>
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
