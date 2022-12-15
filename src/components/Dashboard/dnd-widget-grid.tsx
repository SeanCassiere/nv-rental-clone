import { useState } from "react";
import classNames from "classnames";
import {
  type DragEndEvent,
  DndContext,
  useSensors,
  useSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
} from "@dnd-kit/core";
import {
  arrayMove,
  useSortable,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { DashboardWidgetItemParsed } from "../../utils/schemas/dashboard";

interface DashboardDndWidgetGridProps {
  widgets: DashboardWidgetItemParsed[];
  selectedLocationIds: number[];
  onWidgetSortingEnd: (widgets: DashboardWidgetItemParsed[]) => void;
}
const DashboardDndWidgetGrid = (props: DashboardDndWidgetGridProps) => {
  const { widgets: widgetList, onWidgetSortingEnd } = props;

  const [widgets, setWidgets] = useState([...widgetList]);
  const widgetIdsList = widgets.map((widget) => widget.widgetID);

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {})
  );

  const handleDragEnd = (evt: DragEndEvent) => {
    if (!evt.over || evt.over.disabled || evt.active.id === evt.over.id) return;

    const draggingId = evt.active.id;
    const overId = evt.over.id;

    const newWidgetIdOrder = arrayMove(
      widgetIdsList,
      widgetIdsList.indexOf(draggingId as string),
      widgetIdsList.indexOf(overId as string)
    );
    const reorderedWidgetsList = reorderBasedOnWidgetIdPositions(
      widgets,
      newWidgetIdOrder
    );
    setWidgets(reorderedWidgetsList);
    onWidgetSortingEnd(reorderedWidgetsList);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="grid min-h-[500px] w-full grid-cols-1 gap-4 md:grid-cols-12">
        <SortableContext items={widgetIdsList} strategy={rectSortingStrategy}>
          {widgets
            .filter((widget) => widget.isDeleted === false)
            .map((widget) => (
              <WidgetSizingContainer
                widget={widget}
                key={`widget-${widget.widgetID}`}
              />
            ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};

function reorderBasedOnWidgetIdPositions(
  widgets: DashboardWidgetItemParsed[],
  orderedWidgetIds: string[]
): DashboardWidgetItemParsed[] {
  const copiedWidgets = [...widgets];
  const returnableWidgets: DashboardWidgetItemParsed[] = [];
  if (copiedWidgets.length !== orderedWidgetIds.length) {
    return copiedWidgets;
  }

  orderedWidgetIds.forEach((widgetId, index) => {
    const widget = copiedWidgets.find((widget) => widget.widgetID === widgetId);
    if (widget) {
      widget.widgetUserPosition = index + 1;
      returnableWidgets.push(widget);
    }
  });

  return returnableWidgets;
}

function WidgetSizingContainer({
  widget,
}: {
  widget: DashboardWidgetItemParsed;
}) {
  const {
    setDroppableNodeRef,
    setDraggableNodeRef,
    listeners,
    attributes,
    transform,
    transition,
  } = useSortable({
    id: widget.widgetID,
  });

  return (
    <div
      ref={setDroppableNodeRef}
      className={classNames(
        "col-span-1",
        widget.widgetScale === 1 ? "md:col-span-1" : "",
        widget.widgetScale === 2 ? "md:col-span-2" : "",
        widget.widgetScale === 3 ? "md:col-span-3" : "",
        widget.widgetScale === 4 ? "md:col-span-4" : "",
        widget.widgetScale === 5 ? "md:col-span-5" : "",
        widget.widgetScale === 6 ? "md:col-span-6" : "",
        widget.widgetScale === 7 ? "md:col-span-7" : "",
        widget.widgetScale === 8 ? "md:col-span-8" : "",
        widget.widgetScale === 9 ? "md:col-span-9" : "",
        widget.widgetScale === 10 ? "md:col-span-10" : "",
        widget.widgetScale === 11 ? "md:col-span-11" : "",
        widget.widgetScale === 12 ? "md:col-span-12" : ""
      )}
    >
      <div
        ref={setDraggableNodeRef}
        className="h-full w-full bg-white shadow"
        style={{ transform: CSS.Translate.toString(transform), transition }}
        {...listeners}
        {...attributes}
      >
        {widget.widgetName}
      </div>
    </div>
  );
}

export default DashboardDndWidgetGrid;
