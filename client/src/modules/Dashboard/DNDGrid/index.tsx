import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";

interface IQuote {
	id: string;
	content: string;
}

const initial = Array.from({ length: 5 }, (v, k) => k).map((k) => {
	const custom: IQuote = {
		id: `id-${k}`,
		content: `Quote ${k}`,
	};

	return custom;
});

const grid = 8;
// a little function to help us with reordering the result
const reorder = (list: typeof initial, startIndex: number, endIndex: number) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};
const QuoteItem = styled.div`
	display: inline-block;
	width: 200px;
	border: 1px solid grey;
	margin-bottom: ${grid}px;
	background-color: lightblue;
	padding: ${grid}px;
`;

function Quote({ quote, index }: { quote: IQuote; index: number }) {
	return (
		<Draggable draggableId={quote.id} index={index}>
			{(provided) => (
				<QuoteItem ref={provided.innerRef} {...provided.draggableProps}>
					{quote.content}
					<br />
					<div {...provided.dragHandleProps}>Drag Handle</div>
				</QuoteItem>
			)}
		</Draggable>
	);
}

const Comp = ({ quotes }: { quotes: IQuote[] }) => {
	return (
		<>
			{quotes.map((quote, index: number) => (
				<Quote quote={quote} index={index} key={quote.id} />
			))}
		</>
	);
};

const QuoteList = React.memo(Comp);

const getListStyle = (isDraggingOver: boolean) => ({
	background: isDraggingOver ? "lightblue" : "lightgrey",
	display: "flex",
	padding: grid,
	overflow: "auto",
});

const DNDGrid = () => {
	const [state, setState] = useState({ quotes: initial });

	function onDragEnd(result: any) {
		console.log(result);
		if (!result.destination) {
			return;
		}

		if (result.destination.index === result.source.index) {
			return;
		}

		const quotes = reorder(state.quotes, result.source.index, result.destination.index);

		setState({ quotes });
	}

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId='list' direction='horizontal'>
				{(provided, snapshot) => (
					<div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)} {...provided.droppableProps}>
						<QuoteList quotes={state.quotes} />
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
};

export default DNDGrid;
