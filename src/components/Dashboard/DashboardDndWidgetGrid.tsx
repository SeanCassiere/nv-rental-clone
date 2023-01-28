import { useState } from "react";
import classNames from "classnames";
import {
  type DragEndEvent,
  DndContext,
  useSensors,
  useSensor,
  MouseSensor,
  TouchSensor,
  closestCorners,
} from "@dnd-kit/core";
import {
  arrayMove,
  useSortable,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { DashboardWidgetItemParsed } from "../../utils/schemas/dashboard";

function sortByUserPositionFn(
  widgetA: DashboardWidgetItemParsed,
  widgetB: DashboardWidgetItemParsed
) {
  return widgetA.widgetUserPosition - widgetB.widgetUserPosition;
}

interface DashboardDndWidgetGridProps {
  widgets: DashboardWidgetItemParsed[];
  selectedLocationIds: number[];
  onWidgetSortingEnd: (widgets: DashboardWidgetItemParsed[]) => void;
  isLocked: boolean;
}
const DashboardDndWidgetGrid = (props: DashboardDndWidgetGridProps) => {
  const { widgets: widgetList, onWidgetSortingEnd } = props;
  const isDisabled = props.isLocked;

  const [widgets, setWidgets] = useState([
    ...widgetList.sort(sortByUserPositionFn),
  ]);
  const widgetIdsList = widgets
    .filter((widget) => widget.isDeleted === false)
    .map((widget) => widget.widgetID);

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
    const reorderedWidgetsList = reorderBasedOnWidgetIdPositions({
      widgets: widgetList,
      orderedWidgetIds: newWidgetIdOrder,
    });
    setWidgets(reorderedWidgetsList);
    onWidgetSortingEnd(reorderedWidgetsList);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="grid min-h-[500px] w-full grid-cols-1 gap-4 md:grid-cols-12">
        <SortableContext
          key={widgetIdsList.toString()}
          items={widgetIdsList}
          strategy={rectSortingStrategy}
          disabled={isDisabled}
        >
          {widgets
            .filter((widget) => widget.isDeleted === false)
            .sort(sortByUserPositionFn)
            .map((widget) => (
              <WidgetSizingContainer
                widget={widget}
                key={`widget-${widget.widgetID}`}
                isDisabled={isDisabled}
              />
            ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};

function reorderBasedOnWidgetIdPositions({
  widgets,
  orderedWidgetIds,
}: {
  widgets: DashboardWidgetItemParsed[];
  orderedWidgetIds: string[];
}): DashboardWidgetItemParsed[] {
  const copiedWidgetsWithoutDeleted = [
    ...widgets.filter((w) => w.isDeleted === false).sort(sortByUserPositionFn),
  ];
  const returnableWidgets: DashboardWidgetItemParsed[] = [];

  if (copiedWidgetsWithoutDeleted.length !== orderedWidgetIds.length) {
    return copiedWidgetsWithoutDeleted;
  }

  orderedWidgetIds.forEach((widgetId, index) => {
    const widget = copiedWidgetsWithoutDeleted.find(
      (widget) => widget.widgetID === widgetId
    );
    if (widget) {
      widget.widgetUserPosition = index + 1;
      returnableWidgets.push(widget);
    }
  });

  widgets
    .filter((w) => w.isDeleted)
    .forEach((widget, index) => {
      widget.widgetUserPosition = returnableWidgets.length + index + 1;
      returnableWidgets.push(widget);
    });

  return returnableWidgets.sort(sortByUserPositionFn);
}

function WidgetSizingContainer({
  widget,
  isDisabled,
}: {
  widget: DashboardWidgetItemParsed;
  isDisabled: boolean;
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
    disabled: isDisabled,
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
        className={classNames(
          "h-full w-full rounded border border-slate-200 bg-slate-50",
          { "cursor-move": !isDisabled, "cursor-default": isDisabled }
        )}
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
