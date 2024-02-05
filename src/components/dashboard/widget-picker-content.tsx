import { useCallback, useEffect, useState } from "react";
import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useQuery } from "@tanstack/react-query";

import {
  reorderBasedOnWidgetIdPositions,
  sortWidgetsByUserPositionFn,
} from "@/components/dashboard/dnd-widget-display-grid";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { icons } from "@/components/ui/icons";

import { type DashboardWidgetItemParsed } from "@/lib/schemas/dashboard";
import { fetchDashboardWidgetsOptions } from "@/lib/query/dashboard";
import type { Auth } from "@/lib/query/helpers";

import { cn } from "@/lib/utils";

interface WidgetPickerContentProps extends Auth {
  onModalStateChange: (show: boolean) => void;
  onWidgetSave: (widgets: DashboardWidgetItemParsed[]) => void;
}

const WidgetPickerContent = (props: WidgetPickerContentProps) => {
  const {
    onModalStateChange: setModalOpenState,
    onWidgetSave,
    auth: authParams,
  } = props;

  const [isModalClosingLocked, setModalClosingLocked] = useState(false);

  const [widgetsLocal, setWidgetsLocal] = useState<DashboardWidgetItemParsed[]>(
    []
  );

  const handleClosingOfModal = () => {
    setModalOpenState(false);
  };

  const widgetsQuery = useQuery(
    fetchDashboardWidgetsOptions({ auth: authParams })
  );
  useEffect(() => {
    if (widgetsQuery.status === "success") {
      setWidgetsLocal((local) => {
        if (local.length === 0) {
          return (
            widgetsQuery.data?.status === 200 ? widgetsQuery.data.body : []
          ).sort(sortWidgetsByUserPositionFn);
        }
        return local;
      });
    }
  }, [widgetsQuery.data, widgetsQuery.status]);
  const widgetIdsList = widgetsLocal.map((widget) => widget.widgetID);

  const handleToggleWidgetVisibility = useCallback((widgetID: string) => {
    setWidgetsLocal((widgets) => {
      return widgets.map((widget) => {
        if (widget.widgetID === widgetID) {
          return {
            ...widget,
            isDeleted: !widget.isDeleted,
          };
        }
        return widget;
      });
    });
  }, []);

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (evt: DragEndEvent) => {
    if (!evt.over || evt.over.disabled) {
      return;
    }

    const currentWidgets = [...widgetsLocal];

    const draggingId = evt.active.id;
    const overId = evt.over.id;

    const newWidgetIdOrder = arrayMove(
      widgetIdsList,
      widgetIdsList.indexOf(String(draggingId)),
      widgetIdsList.indexOf(String(overId))
    );

    const reorderedWidgetsList = reorderBasedOnWidgetIdPositions({
      widgets: currentWidgets,
      orderedWidgetIds: newWidgetIdOrder,
    }); // return using sortByUserPositionFn;

    setWidgetsLocal(reorderedWidgetsList);
  };

  const handleWidgetSave = useCallback(() => {
    setModalClosingLocked(true);
    onWidgetSave(widgetsLocal);
    setModalClosingLocked(false);
    setModalOpenState(false);
  }, [widgetsLocal, onWidgetSave, setModalOpenState]);

  return (
    <>
      <ul className="my-2 flex flex-col overflow-y-auto pb-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext
            items={widgetIdsList}
            strategy={verticalListSortingStrategy}
          >
            {widgetsLocal.map((widget) => {
              return (
                <WidgetOption
                  key={`picker-widget-${widget.widgetID}`}
                  widget={widget}
                  onToggleVisibility={handleToggleWidgetVisibility}
                />
              );
            })}
          </SortableContext>
        </DndContext>
      </ul>
      <DialogFooter className="mt-2 flex gap-2 pt-1">
        <Button
          variant="ghost"
          onClick={handleClosingOfModal}
          disabled={isModalClosingLocked}
        >
          Cancel
        </Button>
        <Button onClick={handleWidgetSave} autoFocus>
          Save
        </Button>
      </DialogFooter>
    </>
  );
};

const WidgetOption = ({
  widget,
  onToggleVisibility,
}: {
  widget: DashboardWidgetItemParsed;
  onToggleVisibility: (widgetId: string) => void;
}) => {
  const {
    setNodeRef,
    setActivatorNodeRef,
    listeners,
    attributes,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.widgetID });

  return (
    <li
      ref={setNodeRef}
      key={`picker-widget-${widget.widgetID}`}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div
        className={cn(
          "my-0.5 flex items-center justify-between rounded border px-4 py-2 transition-all",
          isDragging ? "bg-primary/10" : "bg-background"
        )}
      >
        <div className={cn("flex items-center gap-3")}>
          <button
            ref={setActivatorNodeRef}
            className="cursor-grab"
            {...listeners}
            {...attributes}
          >
            <icons.Menu className="h-4 w-4" />
          </button>
          <span className="select-none">{widget.widgetName}</span>
        </div>
        <div className="flex">
          <button
            className="p-2"
            onClick={() => {
              onToggleVisibility(widget.widgetID);
            }}
          >
            {widget.isDeleted ? (
              <icons.EyeOff className="h-4 w-4" />
            ) : (
              <icons.EyeOn className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </li>
  );
};

export default WidgetPickerContent;
