import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Row, Col, Button, Icon, Panel } from "rsuite";

import { AppDispatch, selectViewReservationState } from "../../shared/redux/store";
import { fetchReservationPDFThunk } from "../../shared/redux/thunks/viewReservationThunks";

const ReservationInteractionButtonBar = ({ reservationId }: { reservationId: string }) => {
	const dispatch = useDispatch<AppDispatch>();
	const {
		printPDF: { isPrinting, url },
		isError,
		isSearching,
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
						<Button loading={isPrinting} onClick={handlePrintRequest} disabled={isError || isSearching}>
							<Icon icon='print' size='lg' />
						</Button>
						&nbsp;
						<Button
							loading={isPrinting}
							onClick={() => console.log("email button clicked")}
							disabled={isError || isSearching}
						>
							<Icon icon='envelope' size='lg' />
						</Button>
					</Col>
				</Row>
			</Grid>
		</Panel>
	);
};

export default ReservationInteractionButtonBar;
