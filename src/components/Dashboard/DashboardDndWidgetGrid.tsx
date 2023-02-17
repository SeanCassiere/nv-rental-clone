import { useState, useCallback } from "react";
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

interface DashboardDndWidgetGridProps {
  widgets: DashboardWidgetItemParsed[];
  selectedLocationIds: number[];
  onWidgetSortingEnd: (widgets: DashboardWidgetItemParsed[]) => void;
  isLocked: boolean;
}
const DashboardDndWidgetGrid = (props: DashboardDndWidgetGridProps) => {
  const { widgets: widgetList = [], onWidgetSortingEnd } = props;
  const isDisabled = props.isLocked;

  // used purely to reliably let the animation functions run
  const [localWidgets, setLocalWidgets] = useState(
    [...widgetList].sort(sortByUserPositionFn)
  );
  const widgetIdsList = localWidgets
    .filter((widget) => widget.isDeleted === false)
    .map((widget) => widget.widgetID);

  const handleDragEnd = useCallback(
    (evt: DragEndEvent) => {
      if (!evt.over || evt.over.disabled) {
        return;
      }

      const draggingId = evt.active.id;
      const overId = evt.over.id;

      const newWidgetIdOrder = arrayMove(
        widgetIdsList,
        widgetIdsList.indexOf(String(draggingId)),
        widgetIdsList.indexOf(String(overId))
      );
      const reorderedWidgetsList = reorderBasedOnWidgetIdPositions({
        widgets: widgetList,
        orderedWidgetIds: newWidgetIdOrder,
      }); // return using sortByUserPositionFn;
      setLocalWidgets(reorderedWidgetsList);
      onWidgetSortingEnd(reorderedWidgetsList);
    },
    [widgetList, onWidgetSortingEnd, widgetIdsList]
  );

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {})
  );

  return (
    <ul className="grid min-h-[500px] w-full grid-cols-1 gap-4 transition-all md:grid-cols-12">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={widgetIdsList}
          strategy={rectSortingStrategy}
          disabled={isDisabled}
        >
          {widgetList
            .sort(sortByUserPositionFn)
            .filter((widget) => widget.isDeleted === false)
            .map((widget) => (
              <WidgetSizingContainer
                widget={widget}
                key={`widget-${widget.widgetID}`}
                isDisabled={isDisabled}
              />
            ))}
        </SortableContext>
      </DndContext>
    </ul>
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

function sortByUserPositionFn(
  widgetA: DashboardWidgetItemParsed,
  widgetB: DashboardWidgetItemParsed
) {
  return widgetA.widgetUserPosition - widgetB.widgetUserPosition;
}

function WidgetSizingContainer({
  widget,
  isDisabled,
}: {
  widget: DashboardWidgetItemParsed;
  isDisabled: boolean;
}) {
  const {
    listeners,
    attributes,
    transform,
    transition,
    isDragging,
    setNodeRef,
    setActivatorNodeRef,
  } = useSortable({
    id: widget.widgetID,
    disabled: isDisabled,
  });

  return (
    <li
      ref={setNodeRef}
      // ref={setDroppableNodeRef}
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
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <div
        ref={setActivatorNodeRef}
        // ref={setDraggableNodeRef}
        className={classNames(
          "h-full w-full rounded border border-slate-200 text-slate-600",
          !isDragging ? "transition-all duration-200 ease-in" : "",
          { "cursor-move": !isDisabled, "cursor-default": isDisabled },
          isDisabled ? "bg-slate-50" : "bg-slate-100"
        )}
        {...listeners}
        {...attributes}
      >
        {widget.widgetName}
      </div>
    </li>
  );
}

export default DashboardDndWidgetGrid;
