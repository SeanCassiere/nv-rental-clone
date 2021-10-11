import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Grid, Row, Col } from "rsuite";

import LineChartWidget from "../LineChartWidget";

import DragableIcon from "@rsuite/icons/Dragable";

interface IWidget {
	id: string;
	title: string;
	span: number;
}

const initialWidgets: IWidget[] = [
	{ id: "widget-1", title: "Sales Status", span: 12 },
	{ id: "widget-2", title: "Widget 2", span: 12 },
	{ id: "widget-3", title: "Widget 3", span: 12 },
	{ id: "widget-4", title: "Widget 4", span: 12 },
	{ id: "widget-5", title: "Widget 5", span: 24 },
	{ id: "widget-6", title: "Widget 6", span: 12 },
];

// a little function to help us with reordering the result
const reorder = (list: typeof initialWidgets, startIndex: number, endIndex: number) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};

function chooseWidget(widget: IWidget) {
	switch (widget.id) {
		case "widget-1":
			return <LineChartWidget />;
		case "widget-2":
			return <div style={{ minHeight: 300, width: "100%" }}>widget-2</div>;
		case "widget-3":
			return <div style={{ minHeight: 150, width: "100%" }}>widget-3</div>;
		case "widget-4":
			return <div style={{ minHeight: 150, width: "100%" }}>widget-4</div>;
		case "widget-5":
			return <div style={{ minHeight: 300, width: "100%" }}>widget-5</div>;
		case "widget-6":
			return <div style={{ minHeight: 300, width: "100%" }}>widget-6</div>;
		default:
			return <div style={{ minHeight: 300, width: "100%" }}>no widget component available</div>;
	}
}

function WidgetBlock({ widget, index }: { widget: IWidget; index: number }) {
	return (
		<Draggable draggableId={widget.id} index={index}>
			{(provided) => (
				<Col xs={24} md={widget.span} ref={provided.innerRef} {...provided.draggableProps}>
					<div style={{ minHeight: 150, border: "1px solid #e5e5ea", borderRadius: 5, padding: 10, marginBottom: 10 }}>
						<Row style={{ marginBottom: 20 }}>
							<Col xs={23}>
								<h5>{widget.title}</h5>
							</Col>
							<Col {...provided.dragHandleProps} xs={1}>
								<DragableIcon />
							</Col>
						</Row>
						<Row>
							<Col xs={24}>{chooseWidget(widget)}</Col>
						</Row>
					</div>
				</Col>
			)}
		</Draggable>
	);
}

const WidgetList = React.memo(({ widgets }: { widgets: IWidget[] }) => {
	return (
		<>
			{widgets.map((widget, index: number) => (
				<WidgetBlock widget={widget} index={index} key={widget.id} />
			))}
		</>
	);
});

const DNDGrid = () => {
	const [state, setState] = useState({ widgets: initialWidgets });

	function onDragEnd(result: any) {
		console.log(result);
		if (!result.destination) {
			return;
		}

		if (result.destination.index === result.source.index) {
			return;
		}

		const widgets = reorder(state.widgets, result.source.index, result.destination.index);

		setState({ widgets });
	}

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId='widgets'>
				{(provided) => (
					<Grid ref={provided.innerRef} {...provided.droppableProps} style={{ width: "100%" }}>
						<Row>
							<WidgetList widgets={state.widgets} />
							{provided.placeholder}
						</Row>
					</Grid>
				)}
			</Droppable>
		</DragDropContext>
	);
};

export default DNDGrid;
