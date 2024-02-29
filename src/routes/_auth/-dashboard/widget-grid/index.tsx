import * as React from "react";
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
} from "@dnd-kit/sortable";

import type { DashboardWidgetItemParsed } from "@/lib/schemas/dashboard";
import type { Auth } from "@/lib/query/helpers";

import {
  complexWidgetOrderByNewPositionList,
  widgetSortByUserPosition,
} from "@/lib/utils/dashboard";

import { WidgetFacade } from "./widget-facade";

interface WidgetGridProps extends Auth {
  widgets: DashboardWidgetItemParsed[];
  selectedLocationIds: string[];
  onWidgetSortingEnd: (widgets: DashboardWidgetItemParsed[]) => void;
}

export default function WidgetGrid(props: WidgetGridProps) {
  const { onWidgetSortingEnd } = props;
  const [widgets, setWidgets] = React.useState(() =>
    props.widgets.sort(widgetSortByUserPosition)
  );

  const availableWidgets = React.useMemo(
    () => widgets.filter((w) => !w.isDeleted),
    [widgets]
  );

  const widgetIds = React.useMemo(
    () => availableWidgets.map((w) => w.widgetID),
    [availableWidgets]
  );

  const onDragEnd = React.useCallback(
    (evt: DragEndEvent) => {
      if (!evt.over || evt.over.disabled) {
        return;
      }

      const draggingId = evt.active.id;
      const overId = evt.over.id;

      const newWidgetIdOrder = arrayMove(
        widgetIds,
        widgetIds.indexOf(String(draggingId)),
        widgetIds.indexOf(String(overId))
      );
      const reorderedWidgetsList = complexWidgetOrderByNewPositionList({
        widgets: widgets,
        orderedWidgetIds: newWidgetIdOrder,
        removeDeleted: true,
      });
      setWidgets(reorderedWidgetsList);
      onWidgetSortingEnd(reorderedWidgetsList);
    },
    [onWidgetSortingEnd, widgetIds, widgets]
  );

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {})
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={onDragEnd}
    >
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <SortableContext items={widgetIds} strategy={rectSortingStrategy}>
          {availableWidgets.map((widget) => (
            <WidgetFacade
              key={`widget-${widget.widgetID}`}
              selectedLocationIds={props.selectedLocationIds}
              widget={widget}
              auth={props.auth}
            />
          ))}
        </SortableContext>
      </ul>
    </DndContext>
  );
}
