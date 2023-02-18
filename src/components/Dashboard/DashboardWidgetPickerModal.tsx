import { Fragment, useCallback, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
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
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import classNames from "classnames";

import {
  Bars3Outline,
  EyeOutline,
  EyeSlashOutline,
  XMarkOutline,
} from "../icons";
import { useGetDashboardWidgetList } from "../../hooks/network/dashboard/useGetDashboardWidgetList";
import { Button } from "../Form";
import {
  reorderBasedOnWidgetIdPositions,
  sortWidgetsByUserPositionFn,
} from "./DashboardDndWidgetGrid";
import { type DashboardWidgetItemParsed } from "../../utils/schemas/dashboard";

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
    useSensor(TouchSensor, {})
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
    <Transition show={show} as={Fragment}>
      <Dialog onClose={handleClosingOfModal} className="relative">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 z-40 bg-black/30" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 z-40 flex items-center justify-center">
            <Dialog.Panel className="mx-4">
              <div className="w-full max-w-md rounded bg-white p-4">
                <Dialog.Title className="flex items-center justify-between">
                  <span className="select-none pr-2 text-xl font-semibold leading-6 text-gray-700">
                    Customize widgets
                  </span>
                  <button
                    className="rounded-full p-2 text-slate-600 focus:text-slate-900"
                    onClick={handleClosingOfModal}
                    disabled={isModalClosingLocked}
                  >
                    <XMarkOutline className="h-4 w-4" />
                  </button>
                </Dialog.Title>
                <Dialog.Description className="mt-2 border-b border-gray-200 pb-2 text-sm text-slate-600">
                  Select and order the widgets you want to see on your
                  dashboard.
                </Dialog.Description>
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
                  <Button
                    onClick={handleClosingOfModal}
                    disabled={isModalClosingLocked}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
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
        className={classNames(
          "my-0.5 flex items-center justify-between rounded border border-white px-2 focus-within:border-slate-300",
          isDragging ? "bg-slate-50" : "bg-white"
        )}
      >
        <div className={classNames("flex items-center gap-3")}>
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
