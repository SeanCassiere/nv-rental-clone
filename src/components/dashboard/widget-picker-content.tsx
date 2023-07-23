import { useState, useCallback, useEffect } from "react";
import {
  type DragEndEvent,
  DndContext,
  useSensors,
  useSensor,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  closestCorners,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bars3Outline, EyeOutline, EyeSlashOutline } from "@/components/icons";
import {
  reorderBasedOnWidgetIdPositions,
  sortWidgetsByUserPositionFn,
} from "@/components/dashboard/dnd-widget-display-grid";

import { cn } from "@/utils";
import { type DashboardWidgetItemParsed } from "@/schemas/dashboard";
import { useGetDashboardWidgetList } from "@/hooks/network/dashboard/useGetDashboardWidgetList";

const WidgetPickerContent = ({
  onModalStateChange: setModalOpenState,
  onWidgetSave,
}: {
  onModalStateChange: (show: boolean) => void;
  onWidgetSave: (widgets: DashboardWidgetItemParsed[]) => void;
}) => {
  const [isModalClosingLocked, setModalClosingLocked] = useState(false);

  const [widgetsLocal, setWidgetsLocal] = useState<DashboardWidgetItemParsed[]>(
    []
  );

  const handleClosingOfModal = () => {
    setModalOpenState(false);
  };

  const widgetsQuery = useGetDashboardWidgetList();
  useEffect(() => {
    if (widgetsQuery.status === "success") {
      setWidgetsLocal((local) => {
        if (local.length === 0) {
          return widgetsQuery.data.sort(sortWidgetsByUserPositionFn);
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
          isDragging
            ? "bg-foreground text-primary-foreground"
            : "bg-background text-primary"
        )}
      >
        <div className={cn("flex items-center gap-3")}>
          <button
            ref={setActivatorNodeRef}
            className="cursor-grab"
            {...listeners}
            {...attributes}
          >
            <Bars3Outline className="h-4 w-4" />
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
              <EyeSlashOutline className="h-4 w-4" />
            ) : (
              <EyeOutline className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </li>
  );
};

export default WidgetPickerContent;
