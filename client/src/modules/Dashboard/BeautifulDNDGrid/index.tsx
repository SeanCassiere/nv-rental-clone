import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Row, Col, Panel, IconButton } from "rsuite";
import { DragDropContext, Draggable, Droppable, DropResult, ResponderProvided } from "react-beautiful-dnd";

import HistoryIcon from "@rsuite/icons/History";

import LineChartWidget from "../LineChartWidget";

import { IWidget } from "../../../shared/interfaces/dashboard/widgets";
import { selectDashboard } from "../../../shared/redux/store";
import { setDashboardWidgets } from "../../../shared/redux/slices/dashboardSlice";
import { sortWidgetDeleteEnterReorder, sortWidgetsInAscendingList } from "../../../shared/utils/widgetsFunctions";
import { updateDashboardWidgetThunk } from "../../../shared/redux/thunks/allProcessesThunks/updateDashboardWidget";

export const WIDGET_TRUE_MIN_HEIGHT = 50;
export const WIDGET_SMALL_HEIGHT = 89;
export const WIDGET_MEDIUM_HEIGHT = 300;
export const WIDGET_LARGE_HEIGHT = 250;

function chooseWidget(widget: IWidget) {
	switch (widget.widgetID) {
		case "SalesStatus":
			return (
				<div style={{ minHeight: WIDGET_MEDIUM_HEIGHT, maxHeight: WIDGET_MEDIUM_HEIGHT, width: "100%" }}>
					<LineChartWidget />
				</div>
			);
		case "VehicleStatus":
			return (
				<div style={{ minHeight: WIDGET_MEDIUM_HEIGHT, maxHeight: WIDGET_MEDIUM_HEIGHT, width: "100%" }}>widget-2</div>
			);
		case "QuickLookup":
			return (
				<div style={{ minHeight: WIDGET_SMALL_HEIGHT, maxHeight: WIDGET_SMALL_HEIGHT, width: "100%" }}>widget-3</div>
			);
		case "QuickCheckin":
			return (
				<div style={{ minHeight: WIDGET_SMALL_HEIGHT, maxHeight: WIDGET_SMALL_HEIGHT, width: "100%" }}>widget-4</div>
			);
		case "Todos":
			return (
				<div style={{ minHeight: WIDGET_LARGE_HEIGHT, maxHeight: WIDGET_LARGE_HEIGHT, width: "100%" }}>widget-5</div>
			);
		case "RateSummary":
			return (
				<div style={{ minHeight: WIDGET_MEDIUM_HEIGHT, maxHeight: WIDGET_MEDIUM_HEIGHT, width: "100%" }}>widget-6</div>
			);
		default:
			return (
				<div style={{ minHeight: WIDGET_MEDIUM_HEIGHT, maxHeight: WIDGET_MEDIUM_HEIGHT, width: "100%" }}>
					no widget component available
				</div>
			);
	}
}

function WidgetBlock({ widget, index, editingState }: { widget: IWidget; index: number; editingState: boolean }) {
	const spanNumber = widget.isDeleted ? 5 : widget.widgetScale === "6" ? 12 : 24;
	return (
		<Draggable draggableId={widget.widgetID} index={index} isDragDisabled={!editingState}>
			{(provided) => (
				<Col
					xs={24}
					md={spanNumber}
					// md={parseInt(widget.widgetScale) * 2 ?? 12}
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
				>
					<Panel
						bordered
						style={{ minHeight: 80, marginBottom: widget.isDeleted ? 0 : 10, backgroundColor: "#fff" }}
						header={
							<Row style={{ marginBottom: widget.isDeleted ? 0 : 20 }}>
								<Col xs={24} style={{ minHeight: 30 }}>
									<h5>{widget.widgetName}</h5>
								</Col>
							</Row>
						}
					>
						{!widget.isDeleted && (
							<Row>
								<Col xs={24}>{chooseWidget(widget)}</Col>
							</Row>
						)}
					</Panel>
				</Col>
			)}
		</Draggable>
	);
}

const WidgetList = React.memo(({ widgets, editingState }: { widgets: IWidget[]; editingState: boolean }) => {
	return (
		<>
			{widgets.map((widget, index: number) => (
				<WidgetBlock widget={widget} index={index} key={widget.widgetID} editingState={editingState} />
			))}
		</>
	);
});

const BeautifulDNDGrid = ({ editingState }: { editingState: boolean }) => {
	const dispatch = useDispatch();
	const { widgets } = useSelector(selectDashboard);

	function onDragEnd(result: DropResult, _: ResponderProvided) {
		if (!result.destination) return;

		if (result.source.droppableId === "inactive-widgets" && result.destination.droppableId === "inactive-widgets") {
			return;
		}

		if (result.destination.droppableId === "inactive-widgets" && result.source.droppableId === "active-widgets") {
			const deleteWidget = widgets.filter((i) => i.widgetID === result.draggableId)[0];
			handleChangeView(deleteWidget, true);
			return;
		}

		if (result.source.droppableId === "inactive-widgets" && result.destination.droppableId === "active-widgets") {
			const activateWidget = widgets.filter((i) => i.widgetID === result.draggableId)[0];
			handleChangeView(activateWidget, false);
			return;
		}

		let items = Array.from(widgets);

		if (
			Object.getOwnPropertyNames(items[result.source.index]).length ===
			Object.getOwnPropertyNames(items[result.destination.index]).length
		) {
			const newWidgetAData = { ...items[result.source.index], widgetUserPosition: result.destination.index + 1 };
			items = items.filter((item) => item.widgetID !== newWidgetAData.widgetID);
			items = [...items, newWidgetAData];

			const newWidgetBData = { ...items[result.destination.index], widgetUserPosition: result.source.index + 1 };
			items = items.filter((item) => item.widgetID !== newWidgetBData.widgetID);
			items = [...items, newWidgetBData];

			dispatch(updateDashboardWidgetThunk([newWidgetAData, newWidgetBData]));
			dispatch(setDashboardWidgets(sortWidgetsInAscendingList(items)));
		}
	}

	function handleChangeView(widget: IWidget, isDeleted: boolean) {
		let modifiedWidget: IWidget = { ...widget, isDeleted };
		let items = Array.from(widgets);

		items = items.filter((item) => item.widgetID !== modifiedWidget.widgetID);
		items = [...items, modifiedWidget];

		const reordered = sortWidgetDeleteEnterReorder(items);
		dispatch(updateDashboardWidgetThunk(reordered));
		dispatch(setDashboardWidgets(reordered));
	}

	function handleResetAllWidgets() {
		const items = Array.from(widgets);

		const updatedWidgetList = items.map((widget) => {
			return { ...widget, isDeleted: false, widgetUserPosition: widget.widgetPosition };
		});

		dispatch(updateDashboardWidgetThunk(updatedWidgetList));
		dispatch(setDashboardWidgets(sortWidgetsInAscendingList(updatedWidgetList)));
	}

	const activeWidgets = widgets.filter((w) => w.isDeleted === false);
	const inActiveWidgets = widgets.filter((w) => w.isDeleted === true);

	return (
		<>
			<DragDropContext onDragEnd={onDragEnd}>
				<Grid fluid>
					<Row style={{ marginBottom: 10 }}>
						<Col xs={24}>
							<Droppable droppableId='inactive-widgets'>
								{(provided) => (
									<Grid ref={provided.innerRef} {...provided.droppableProps} style={{ width: "100%" }}>
										{editingState && (
											<div
												style={{
													minHeight: 120,
													backgroundColor: "#fff",
													border: "5px dashed rgba(255, 105, 105, 0.5)",
													padding: "20px 20px 20px 20px",
													borderRadius: 5,
												}}
											>
												<Row style={{ marginBottom: 10 }}>
													<Col xs={24}>
														<IconButton
															color='yellow'
															appearance='primary'
															onClick={handleResetAllWidgets}
															icon={<HistoryIcon />}
														/>
													</Col>
												</Row>
												<Row style={{ position: "relative" }}>
													{inActiveWidgets.length === 0 ? (
														<div
															style={{
																position: "absolute",
																inset: 0,
																width: "100%",
																display: "flex",
																justifyContent: "center",
																alignItems: "center",
																height: "100%",
															}}
														>
															<span style={{ display: "block" }}>Using all the available widgets</span>
														</div>
													) : (
														<WidgetList widgets={inActiveWidgets} editingState={editingState} />
													)}

													{provided.placeholder}
												</Row>
											</div>
										)}
									</Grid>
								)}
							</Droppable>
						</Col>
					</Row>

					<Row>
						<Col xs={24}>
							<Droppable droppableId='active-widgets'>
								{(provided) => (
									<Grid ref={provided.innerRef} {...provided.droppableProps} style={{ width: "100%" }}>
										<Row
											style={{
												border: editingState ? "5px dashed rgba(48, 208, 182, 0.5)" : "none",
												backgroundColor: "#fff",
												padding: editingState ? "10px 5px 10px 5px" : 0,
												borderRadius: 5,
											}}
										>
											<WidgetList widgets={activeWidgets} editingState={editingState} />
											{provided.placeholder}
										</Row>
									</Grid>
								)}
							</Droppable>
						</Col>
					</Row>
				</Grid>
			</DragDropContext>
		</>
	);
};

export default BeautifulDNDGrid;
