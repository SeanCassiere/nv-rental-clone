import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Row, Col, Button, Icon, Panel } from "rsuite";

import { AppDispatch, selectViewAgreementState } from "../../redux/store";
import { fetchAgreementPDFThunk } from "../../redux/thunks/viewAgreementThunks";

const AgreementInteractionButtonBar = ({ agreementId }: { agreementId: string }) => {
	const dispatch = useDispatch<AppDispatch>();
	const {
		agreement,
		printPDF: { isPrinting, url },
		isError,
		isSearching,
	} = useSelector(selectViewAgreementState);

	React.useEffect(() => {
		if (url === null) return;

		window.open(url, "_blank");
	}, [url]);

	const handlePrintRequest = React.useCallback(() => {
		if (!agreement) return;

		dispatch(fetchAgreementPDFThunk({ id: agreementId, status: agreement?.statusId }));
	}, [dispatch, agreementId, agreement]);

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

export default AgreementInteractionButtonBar;
