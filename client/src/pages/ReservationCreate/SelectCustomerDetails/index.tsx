import React from "react";
import { useDispatch } from "react-redux";
import { FlexboxGrid, Panel, Button, Col } from "rsuite";

import { setCreateResNavPosition } from "../../../redux/slices/createReservationSlice";
import { AppDispatch } from "../../../redux/store";

const SelectCustomerDetails = () => {
	const dispatch = useDispatch<AppDispatch>();

	const handleNextPage = React.useCallback(() => dispatch(setCreateResNavPosition(2)), [dispatch]);

	const handlePrevPage = React.useCallback(() => dispatch(setCreateResNavPosition(0)), [dispatch]);

	return (
		<FlexboxGrid>
			<FlexboxGrid.Item colspan={24}>
				<Panel header='Select Customer' bordered></Panel>
			</FlexboxGrid.Item>
			<FlexboxGrid.Item componentClass={Col} colspan={24} style={{ margin: "10px 0" }}>
				<Panel style={{ padding: "10px 0px" }} bodyFill>
					<FlexboxGrid justify='end'>
						<FlexboxGrid.Item componentClass={Col} xs={24} colspan={10} style={{ textAlign: "right" }}>
							<Button onClick={handlePrevPage}>Previous</Button>&nbsp;
							<Button onClick={handleNextPage} appearance='primary'>
								Next
							</Button>
						</FlexboxGrid.Item>
					</FlexboxGrid>
				</Panel>
			</FlexboxGrid.Item>
		</FlexboxGrid>
	);
};

export default React.memo(SelectCustomerDetails);
