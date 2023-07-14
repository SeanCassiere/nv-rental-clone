import { useCallback, useState } from "react";
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

import { Bars3Outline, EyeOutline, EyeSlashOutline } from "../icons";
import { useGetDashboardWidgetList } from "@/hooks/network/dashboard/useGetDashboardWidgetList";
import { Button } from "../Form";
import {
  reorderBasedOnWidgetIdPositions,
  sortWidgetsByUserPositionFn,
} from "../Dashboard/DashboardDndWidgetGrid";
import DarkBgDialog from "../Layout/DarkBgDialog";
import { cn } from "@/utils";

import { type DashboardWidgetItemParsed } from "@/schemas/dashboard";

const DashboardWidgetPickerModal = ({
  show = false,
  onModalStateChange: setModalOpenState,
  onWidgetSave,
}: {
  show: boolean | undefined;
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

  useGetDashboardWidgetList({
    onSuccess: (data) => {
      if (widgetsLocal.length === 0) {
        setWidgetsLocal(data.sort(sortWidgetsByUserPositionFn));
      }
    },
  });
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
    <DarkBgDialog
      show={show}
      setShow={setModalOpenState}
      onClose={handleClosingOfModal}
      restrictClose={isModalClosingLocked}
      sizing="md"
      title={"Customize widgets"}
      description={
        "Select and order the widgets you want to see on your dashboard."
      }
    >
      <ul className="my-2 flex h-[360px] flex-col overflow-y-auto border-b border-gray-200 pb-2">
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
      <div className="mt-2 flex gap-2 pt-1">
        <Button color="teal" onClick={handleWidgetSave} autoFocus>
          Save
        </Button>
        <Button onClick={handleClosingOfModal} disabled={isModalClosingLocked}>
          Cancel
        </Button>
      </div>
    </DarkBgDialog>
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
          "my-0.5 flex items-center justify-between rounded border border-white px-2 focus-within:border-slate-300",
          isDragging ? "bg-slate-50" : "bg-white"
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

export default DashboardWidgetPickerModal;
