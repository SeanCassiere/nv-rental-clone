import React from "react";
import { DragDropContext, Draggable, Droppable, DropResult, ResponderProvided } from "react-beautiful-dnd";
import { Grid, Row, Col, Panel } from "rsuite";

import LineChartWidget from "../LineChartWidget";

import DragableIcon from "@rsuite/icons/Dragable";
import { IWidget } from "../../../shared/interfaces/dashboard/widgets";
import { useDispatch, useSelector } from "react-redux";
import { selectDashboard } from "../../../shared/redux/store";
import { setDashboardWidgets } from "../../../shared/redux/slices/dashboardSlice";
import {
	updateWidgetAThunk,
	updateWidgetBThunk,
} from "../../../shared/redux/thunks/allProcessesThunks/fetchWidgetsList";
import { sortAscendingList } from "../../../shared/utils/sortsWidgetsOrder";

function chooseWidget(widget: IWidget) {
	switch (widget.widgetID) {
		case "SalesStatus":
			return <LineChartWidget />;
		case "VehicleStatus":
			return <div style={{ minHeight: 300, width: "100%" }}>widget-2</div>;
		case "QuickLookup":
			return <div style={{ minHeight: 150, width: "100%" }}>widget-3</div>;
		case "QuickCheckin":
			return <div style={{ minHeight: 150, width: "100%" }}>widget-4</div>;
		case "Todos":
			return <div style={{ minHeight: 300, width: "100%" }}>widget-5</div>;
		case "RateSummary":
			return <div style={{ minHeight: 300, width: "100%" }}>widget-6</div>;
		default:
			return <div style={{ minHeight: 300, width: "100%" }}>no widget component available</div>;
	}
}

function WidgetBlock({ widget, index }: { widget: IWidget; index: number }) {
	return (
		<Draggable draggableId={widget.widgetID} index={index}>
			{(provided) => (
				<Col xs={24} md={parseInt(widget.widgetScale) * 2 ?? 12} ref={provided.innerRef} {...provided.draggableProps}>
					<Panel
						header={
							<Row style={{ marginBottom: 20 }}>
								<Col xs={23}>
									<h6>{widget.widgetName}</h6>
								</Col>
								<Col {...provided.dragHandleProps} xs={1}>
									<DragableIcon />
								</Col>
							</Row>
						}
						style={{ minHeight: 150, marginBottom: 10 }}
						bordered
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

const WidgetList = React.memo(({ widgets }: { widgets: IWidget[] }) => {
	return (
		<>
			{widgets
				.filter((w) => !w.isDeleted)
				.map((widget, index: number) => (
					<WidgetBlock widget={widget} index={index} key={widget.widgetID} />
				))}
		</>
	);
});

const BeautifulDNDGrid = () => {
	const dispatch = useDispatch();

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

			dispatch(updateWidgetAThunk(newWidgetAData));
			dispatch(updateWidgetBThunk(newWidgetBData));

			dispatch(setDashboardWidgets(sortAscendingList(items)));
		}
	}

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId='widgets'>
				{(provided) => (
					<Grid ref={provided.innerRef} {...provided.droppableProps} style={{ width: "100%" }}>
						<Row>
							<WidgetList widgets={widgets} />
							{provided.placeholder}
						</Row>
					</Grid>
				)}
			</Droppable>
		</DragDropContext>
	);
};

export default BeautifulDNDGrid;
