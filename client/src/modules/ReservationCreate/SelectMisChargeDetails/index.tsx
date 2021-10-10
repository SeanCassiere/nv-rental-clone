import React from "react";
import { useDispatch } from "react-redux";
import { FlexboxGrid, Panel, Button, Col } from "rsuite";

import { setJumpCreateResNavPosition } from "../../../shared/redux/slices/createReservationSlice";
import { AppDispatch } from "../../../shared/redux/store";

const SelectMiscChargeDetails = () => {
	const dispatch = useDispatch<AppDispatch>();

	const handlePrevPage = React.useCallback(() => dispatch(setJumpCreateResNavPosition("vehicle")), [dispatch]);
	const handleNextPage = React.useCallback(() => console.log("Finished"), []);

	return (
		<FlexboxGrid align='top'>
			<FlexboxGrid.Item colspan={24}>
				<Panel header='Select Miscellaneous Charges' bordered></Panel>
			</FlexboxGrid.Item>
			<FlexboxGrid.Item componentClass={Col} colspan={24} style={{ margin: "10px 0" }}>
				<Panel style={{ padding: "10px 0px" }} bodyFill>
					<FlexboxGrid justify='end'>
						<FlexboxGrid.Item componentClass={Col} xs={24} colspan={10} style={{ textAlign: "right" }}>
							<Button onClick={handlePrevPage}>Previous</Button>&nbsp;
							<Button onClick={handleNextPage} appearance='primary'>
								Finish
							</Button>
						</FlexboxGrid.Item>
					</FlexboxGrid>
				</Panel>
			</FlexboxGrid.Item>
		</FlexboxGrid>
	);
};

export default React.memo(SelectMiscChargeDetails);
