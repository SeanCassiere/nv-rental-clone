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

// a little function to help us with reordering the result
const reorder = (list: IWidget[], startIndex: number, endIndex: number) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};

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
			items = [...items, { ...items[result.source.index], widgetUserPosition: result.destination.index + 1 }];
			items = [...items, { ...items[result.destination.index], widgetUserPosition: result.destination.index + 1 }];

			// console.log(`widget a ${items[result.source.index].widgetName}`, items[result.source.index]);
			// console.log(`widget b ${items[result.destination.index].widgetName}`, items[result.destination.index]);

			const updatedWidgets = reorder(widgets, result.source.index, result.destination.index);

			dispatch(updateWidgetAThunk(updatedWidgets[result.source.index]));
			dispatch(updateWidgetBThunk(updatedWidgets[result.destination.index]));

			// console.log(`widget a ${updatedWidgets[result.source.index].widgetName}`, updatedWidgets[result.source.index]);
			// console.log(
			// 	`widget b ${updatedWidgets[result.destination.index].widgetName}`,
			// 	updatedWidgets[result.destination.index]
			// );

			dispatch(setDashboardWidgets(updatedWidgets));
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
