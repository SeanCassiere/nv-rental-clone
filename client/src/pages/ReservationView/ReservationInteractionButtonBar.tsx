import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Row, Col, Button, Icon, Panel } from "rsuite";

import { AppDispatch, selectViewReservationState } from "../../redux/store";
import { fetchReservationPDFThunk } from "../../redux/thunks/viewReservationThunks";

const ReservationInteractionButtonBar = ({ reservationId }: { reservationId: string }) => {
	const dispatch = useDispatch<AppDispatch>();
	const {
		printPDF: { isPrinting, url },
		isError,
	} = useSelector(selectViewReservationState);

	React.useEffect(() => {
		if (url === null) return;

		window.open(url, "_blank");
	}, [url]);

	const handlePrintRequest = React.useCallback(() => {
		dispatch(fetchReservationPDFThunk(reservationId));
	}, [dispatch, reservationId]);

	return (
		<Panel bodyFill>
			<Grid fluid>
				<Row>
					<Col>
						<Button loading={isPrinting} onClick={handlePrintRequest} disabled={isError}>
							<Icon icon='print' size='lg' />
						</Button>
					</Col>
				</Row>
			</Grid>
		</Panel>
	);
};

export default ReservationInteractionButtonBar;
