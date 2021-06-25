import React from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Row, Col, Button, Icon, Panel } from "rsuite";

import { AppDispatch, selectViewReservationState } from "../../redux/store";
import { fetchReservationPDFThunk } from "../../redux/thunks/viewReservationThunks";

type PageParams = {
	id: string;
};

const ReservationInteractionButtonBar = () => {
	const dispatch = useDispatch<AppDispatch>();
	const {
		printPDF: { isPrinting, url },
	} = useSelector(selectViewReservationState);

	const { id } = useParams<PageParams>();

	React.useEffect(() => {
		if (url === null) return;

		window.open(url, "_blank");
	}, [url]);

	const handlePrintRequest = React.useCallback(() => {
		dispatch(fetchReservationPDFThunk(id));
	}, [dispatch, id]);

	return (
		<Panel bodyFill>
			<Grid fluid>
				<Row>
					<Col>
						<Button loading={isPrinting} onClick={handlePrintRequest}>
							<Icon icon='print' size='lg' />
						</Button>
					</Col>
				</Row>
			</Grid>
		</Panel>
	);
};

export default ReservationInteractionButtonBar;
