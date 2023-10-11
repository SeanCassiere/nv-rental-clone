import { lazy, Suspense, useCallback, useState } from "react";
import {
  closestCorners,
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import type { DashboardWidgetItemParsed } from "@/schemas/dashboard";

import { cn } from "@/utils";

const VehicleStatusWidget = lazy(() => import("./widgets/vehicle-status"));
const SalesStatusWidget = lazy(() => import("./widgets/sales-status"));
const QuickCheckinAgreement = lazy(
  () => import("./widgets/quick-checkin-agreement")
);

interface DashboardDndWidgetGridProps {
  widgets: DashboardWidgetItemParsed[];
  selectedLocationIds: string[];
  onWidgetSortingEnd: (widgets: DashboardWidgetItemParsed[]) => void;
  isLocked: boolean;
}
const DashboardDndWidgetGrid = (props: DashboardDndWidgetGridProps) => {
  const { widgets: widgetList = [], onWidgetSortingEnd } = props;
  const isDisabled = props.isLocked;

  // used purely to reliably let the animation functions run
  const [localWidgets, setLocalWidgets] = useState(
    [...widgetList].sort(sortWidgetsByUserPositionFn)
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
        removeDeleted: true,
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
    <ul className="grid min-h-[500px] w-full grid-cols-1 gap-4 overflow-x-clip transition-all md:grid-cols-12">
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
            .sort(sortWidgetsByUserPositionFn)
            .filter((widget) => widget.isDeleted === false)
            .map((widget) => (
              <WidgetSizingContainer
                widget={widget}
                key={`widget-${widget.widgetID}`}
                isDisabled={isDisabled}
                currentLocations={props.selectedLocationIds}
              />
            ))}
        </SortableContext>
      </DndContext>
    </ul>
  );
};

export function reorderBasedOnWidgetIdPositions({
  widgets,
  orderedWidgetIds,
  removeDeleted = false,
}: {
  widgets: DashboardWidgetItemParsed[];
  orderedWidgetIds: string[];
  removeDeleted?: boolean;
}): DashboardWidgetItemParsed[] {
  const copiedWidgetsWithoutDeleted = removeDeleted
    ? [
        ...widgets
          .filter((w) => w.isDeleted === false)
          .sort(sortWidgetsByUserPositionFn),
      ]
    : [...widgets].sort(sortWidgetsByUserPositionFn);
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

  if (removeDeleted) {
    widgets
      .filter((w) => w.isDeleted)
      .forEach((widget, index) => {
        widget.widgetUserPosition = returnableWidgets.length + index + 1;
        returnableWidgets.push(widget);
      });
  }

  // remove duplicates based on the widgetID
  const withOutDuplicates = returnableWidgets.filter(
    (thing, index, self) =>
      index === self.findIndex((t) => t.widgetID === thing.widgetID)
  );

  return withOutDuplicates.sort(sortWidgetsByUserPositionFn);
}

export function sortWidgetsByUserPositionFn(
  widgetA: DashboardWidgetItemParsed,
  widgetB: DashboardWidgetItemParsed
) {
  return widgetA.widgetUserPosition - widgetB.widgetUserPosition;
}

function renderWidgetView(
  widget: DashboardWidgetItemParsed,
  { locations }: { locations: string[] }
) {
  const widgetId = widget.widgetID;
  switch (widgetId) {
    case "VehicleStatus":
      return <VehicleStatusWidget locations={locations} />;
    case "SalesStatus":
      return <SalesStatusWidget locations={locations} />;
    case "QuickCheckin":
      return <QuickCheckinAgreement />;
    default:
      return (
        <>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">
              Widget "{widgetId}" not found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="">No content</p>
          </CardContent>
        </>
      );
  }
}

function WidgetSizingContainer({
  widget,
  isDisabled,
  currentLocations,
}: {
  widget: DashboardWidgetItemParsed;
  isDisabled: boolean;
  currentLocations: string[];
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
      className={cn(
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
      <Card
        ref={setActivatorNodeRef}
        className={cn(
          "h-full",
          !isDragging ? "transition-all duration-200 ease-in" : "",
          { "cursor-move": !isDisabled, "cursor-default": isDisabled }
        )}
        {...listeners}
        {...attributes}
      >
        <Suspense fallback={<WidgetSkeleton />}>
          {renderWidgetView(widget, { locations: currentLocations })}
        </Suspense>
      </Card>
    </li>
  );
}

export function WidgetSkeleton() {
  return <Skeleton className="h-full min-h-[250px] w-full rounded-sm" />;
}

export default DashboardDndWidgetGrid;
