import React, { useState } from "react";
import { Panel, Grid, Row, Col, IconButton, Button, Divider } from "rsuite";
import { useDispatch, useSelector } from "react-redux";

import CheckIcon from "@rsuite/icons/Check";
import MoveDownIcon from "@rsuite/icons/MoveDown";
import AddOutlineIcon from "@rsuite/icons/AddOutline";

import { AppDispatch, selectAuthUserState } from "../../shared/redux/store";
import { fetchWidgetsList } from "../../shared/redux/thunks/allProcessesThunks/fetchWidgetsList";

import BeautifulDNDGrid from "./BeautifulDNDGrid";
import AppPageContainer from "../../shared/components/AppPageContainer";

const DashboardPage: React.FunctionComponent = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { clientId, userId } = useSelector(selectAuthUserState);

	const [isEditingLayout, setIsEditingLayout] = useState(false);

	const makeApiCall = React.useCallback(() => dispatch(fetchWidgetsList()), [dispatch]);

	React.useEffect(() => {
		if (!clientId || !userId) return;

		const promise = makeApiCall();

		return () => promise.abort();
	}, [dispatch, clientId, userId, makeApiCall]);

	return (
		<AppPageContainer>
			<div style={{ padding: 5 }}>
				<Panel
					header={
						<Grid fluid>
							<Row>
								<Col xs={24} md={18} style={{ marginBottom: 10 }}>
									<h4>Dashboard</h4>
								</Col>
								<Col xs={24} md={6} style={{ marginBottom: 10 }}>
									<div style={{ textAlign: "right", width: "100%" }}>
										{!isEditingLayout && (
											<>
												<Button appearance='primary'>
													<AddOutlineIcon />
													&nbsp;Something!
												</Button>
												<Divider vertical />
											</>
										)}

										<IconButton
											appearance='ghost'
											color={isEditingLayout ? "green" : "cyan"}
											icon={isEditingLayout ? <CheckIcon /> : <MoveDownIcon />}
											onClick={() => setIsEditingLayout((e) => !e)}
										/>
									</div>
								</Col>
							</Row>
						</Grid>
					}
					bordered
					style={{ marginBottom: 10 }}
					defaultExpanded
				>
					<div>Dash</div>
					<br />
				</Panel>
			</div>
			<BeautifulDNDGrid editingState={isEditingLayout} />
		</AppPageContainer>
	);
};

export default DashboardPage;
