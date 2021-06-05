import React from "react";
import styled from "styled-components";
import { Link as RouterLink } from "react-router-dom";
import { Message } from "rsuite";

import AppPageContainer from "../../components/AppPageContainer";

const NotFoundPage: React.FunctionComponent = () => {
	return (
		<AppPageContainer>
			<CenterFlex>
				<Message
					showIcon
					type='error'
					title='Resource not found'
					description={
						<p>
							The page you are looking for cannot be found
							<br />
							<RouterLink to='/dashboard'>Go back to the Dashboard</RouterLink>
						</p>
					}
				/>
			</CenterFlex>
		</AppPageContainer>
	);
};

export default NotFoundPage;

const CenterFlex = styled.div`
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`;
