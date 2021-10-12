import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Row, Col, Panel, IconButton } from "rsuite";
import { DragDropContext, Draggable, Droppable, DropResult, ResponderProvided } from "react-beautiful-dnd";

import TrashIcon from "@rsuite/icons/Trash";

import LineChartWidget from "../LineChartWidget";

import { IWidget } from "../../../shared/interfaces/dashboard/widgets";
import { selectAuthUserState, selectDashboard } from "../../../shared/redux/store";
import { setDashboardWidgets } from "../../../shared/redux/slices/dashboardSlice";
import { sortAscendingList } from "../../../shared/utils/sortsWidgetsOrder";
import { updateDashboardWidget } from "../../../shared/api/updateDashboardWidget";

type HandleChangeViewFunc = (widget: IWidget, isDelete: boolean) => void;

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

function WidgetBlock({
	widget,
	index,
	editingState,
	handleDelete,
}: {
	widget: IWidget;
	index: number;
	editingState: boolean;
	handleDelete: HandleChangeViewFunc;
}) {
	return (
		<Draggable draggableId={widget.widgetID} index={index} isDragDisabled={!editingState}>
			{(provided) => (
				<Col
					xs={24}
					md={parseInt(widget.widgetScale) * 2 ?? 12}
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
				>
					<Panel
						bordered
						style={{ minHeight: 100, marginBottom: 10, backgroundColor: "#fff" }}
						header={
							<Row style={{ marginBottom: 20 }}>
								<Col xs={19} style={{ minHeight: 30 }}>
									<h5>{widget.widgetName}</h5>
								</Col>
								<Col xs={5}>
									<div style={{ width: "100%", textAlign: "right" }}>
										{editingState && (
											<>
												<IconButton
													appearance='ghost'
													size='sm'
													color='red'
													icon={<TrashIcon />}
													onClick={() => handleDelete(widget, true)}
												/>
											</>
										)}
									</div>
								</Col>
							</Row>
						}
					>
						<Row>
							<Col xs={24}>{chooseWidget(widget)}</Col>
						</Row>
					</Panel>
				</Col>
			)}
		</Draggable>
	);
}

const WidgetList = React.memo(
	({
		widgets,
		editingState,
		handleDelete,
	}: {
		widgets: IWidget[];
		editingState: boolean;
		handleDelete: HandleChangeViewFunc;
	}) => {
		return (
			<>
				{widgets
					.filter((w) => !w.isDeleted)
					.map((widget, index: number) => (
						<WidgetBlock
							widget={widget}
							index={index}
							key={widget.widgetID}
							editingState={editingState}
							handleDelete={handleDelete}
						/>
					))}
			</>
		);
	}
);

const BeautifulDNDGrid = ({ editingState }: { editingState: boolean }) => {
	const dispatch = useDispatch();
	const { token } = useSelector(selectAuthUserState);
	const { widgets } = useSelector(selectDashboard);

	function onDragEnd(result: DropResult, _: ResponderProvided) {
		if (!result.destination) return;

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

			updateDashboardWidget(newWidgetAData, token);
			updateDashboardWidget(newWidgetBData, token);

			dispatch(setDashboardWidgets(sortAscendingList(items)));
		}
	}

	function handleChangeView(widget: IWidget, isDeleted: boolean) {
		let modifiedWidget: IWidget = { ...widget, isDeleted };
		let items = Array.from(widgets);

		items = items.filter((item) => item.widgetID !== modifiedWidget.widgetID);
		items = [...items, modifiedWidget];

		updateDashboardWidget(modifiedWidget, token);
		dispatch(setDashboardWidgets(sortAscendingList(items)));
	}

	return (
		<>
			{editingState && (
				<Panel header='Unused widgets' bordered style={{ margin: "0 5px 10px 5px" }}>
					{widgets.filter((w) => w.isDeleted).length === 0 ? (
						<div>You have used all the available widgets.</div>
					) : (
						widgets
							.filter((w) => w.isDeleted)
							.map((w) => (
								<div key={w.widgetID}>
									<button onClick={() => handleChangeView(w, false)}>{w.widgetName}</button>
								</div>
							))
					)}
				</Panel>
			)}
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId='widgets'>
					{(provided) => (
						<Grid ref={provided.innerRef} {...provided.droppableProps} style={{ width: "100%" }}>
							<Row>
								<WidgetList widgets={widgets} editingState={editingState} handleDelete={handleChangeView} />
								{provided.placeholder}
							</Row>
						</Grid>
					)}
				</Droppable>
			</DragDropContext>
		</>
	);
};

export default BeautifulDNDGrid;
