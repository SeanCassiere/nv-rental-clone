import * as React from "react";
import type {
  DragEndEvent,
  DraggableAttributes,
  DraggableSyntheticListeners,
  DragStartEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { icons } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/skeleton";

import type { DashboardWidgetItemParsed } from "@/lib/schemas/dashboard";
import {
  fetchDashboardWidgetsOptions,
  saveDashboardWidgetsMutationOptions,
} from "@/lib/query/dashboard";
import type { Auth } from "@/lib/query/helpers";

import { widgetSortByUserPosition } from "@/lib/utils/dashboard";

import { cn } from "@/lib/utils";

import { useWidgetName } from "../useWidgetName";

interface WidgetPickerProps extends Auth {}

export default function WidgetPicker(props: WidgetPickerProps) {
  const { auth } = props;

  const navigate = useNavigate({ from: "/" });
  const { show_widget_picker } = useSearch({ from: "/_auth/(dashboard)/" });

  const onShowWidgetPicker = React.useCallback(
    (open: boolean) => {
      navigate({
        search: (search) => ({ ...search, show_widget_picker: open }),
      });
    },
    [navigate]
  );

  const widgetsQueryOptions = React.useMemo(
    () => fetchDashboardWidgetsOptions({ auth }),
    [auth]
  );

  const widgetsQuery = useQuery(widgetsQueryOptions);
  const widgets =
    widgetsQuery.data?.status === 200
      ? widgetsQuery.data?.body.sort(widgetSortByUserPosition)
      : [];

  return (
    <Dialog open={show_widget_picker} onOpenChange={onShowWidgetPicker}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <icons.Settings className="h-5 w-5 sm:h-4 sm:w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Customize widgets</DialogTitle>
          <DialogDescription>
            Select and order the widgets you want to see on your dashboard.
          </DialogDescription>
        </DialogHeader>
        {widgetsQuery.status === "pending" ? (
          <Skeleton style={{ height: 350 }} />
        ) : widgetsQuery.status === "error" ? (
          <p>Error loading widgets</p>
        ) : (
          <SortableWidgetList
            key={`widget_picker:${JSON.stringify(widgets)}`}
            widgets={widgets}
            auth={auth}
            dashboardQueryKey={widgetsQueryOptions.queryKey}
            setDialogVisible={onShowWidgetPicker}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
WidgetPicker.displayName = "WidgetPicker";

interface SortableWidgetListProps extends Auth {
  widgets: DashboardWidgetItemParsed[];
  dashboardQueryKey: string[];
  setDialogVisible: (open: boolean) => void;
}
function SortableWidgetList(props: SortableWidgetListProps) {
  const { setDialogVisible, dashboardQueryKey, auth } = props;

  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [widgets, setWidgets] = React.useState(() => props.widgets);
  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null);

  const activeWidget = widgets.find((widget) => widget.widgetID === activeId);

  const widgetIds = widgets.map((widget) => widget.widgetID);

  const onDragStart = React.useCallback((evt: DragStartEvent) => {
    setActiveId(evt.active.id);
  }, []);

  const onDragEnd = React.useCallback((evt: DragEndEvent) => {
    const { active, over } = evt;

    if (over && active.id !== over.id) {
      setWidgets((widgets) => {
        const widgetIds = widgets.map((widget) => widget.widgetID);

        const oldIndex = widgetIds.indexOf(active.id as string);
        const newIndex = widgetIds.indexOf(over.id as string);

        const newItems = arrayMove(widgetIds, oldIndex, newIndex);

        const newWidgetOrder = newItems
          .map((widgetId) => {
            return widgets.find((widget) => widget.widgetID === widgetId);
          })
          .filter(
            (widget) => widget !== undefined
          ) as DashboardWidgetItemParsed[];

        return newWidgetOrder;
      });
    }

    setActiveId(null);
  }, []);

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const saveFn = useMutation({
    ...saveDashboardWidgetsMutationOptions(),
    onMutate: () => {
      queryClient.cancelQueries({
        queryKey: dashboardQueryKey,
      });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: dashboardQueryKey,
      });
      setDialogVisible(false);
    },
  });

  const handleToggleWidgetVisibility = React.useCallback((widgetID: string) => {
    setWidgets((widgets) => {
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

  const handleCancel = React.useCallback(() => {
    setWidgets(props.widgets);
    setDialogVisible(false);
  }, [setDialogVisible, props.widgets]);

  const handleSave = React.useCallback(() => {
    const list = widgets.map((widget, idx) => {
      widget.widgetUserPosition = idx + 1;
      return widget;
    });
    saveFn.mutate({ widgets: list, auth });
  }, [auth, saveFn, widgets]);

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={widgetIds}
          strategy={verticalListSortingStrategy}
        >
          <ul className="relative flex flex-col gap-1 overflow-y-auto">
            {widgets.map((widget) => (
              <SortableWidgetItem
                key={`widget_picker:${widget.widgetID}`}
                widgetId={widget.widgetID}
                isVisible={!widget.isDeleted}
                onToggleVisibility={handleToggleWidgetVisibility}
              />
            ))}
            {createPortal(
              <DragOverlay>
                {activeWidget ? (
                  <WidgetItem
                    id={String(activeWidget.widgetID)}
                    widgetId={String(activeWidget.widgetID)}
                    isVisible={!activeWidget.isDeleted}
                  />
                ) : null}
              </DragOverlay>,
              document.getElementById("root")!
            )}
          </ul>
        </SortableContext>
      </DndContext>
      <DialogFooter className="mt-2 flex gap-2 pt-1">
        <Button
          type="button"
          variant="ghost"
          onClick={handleCancel}
          disabled={saveFn.isPending}
        >
          {t("buttons.cancel", { ns: "labels" })}
        </Button>
        <Button type="button" onClick={handleSave}>
          {saveFn.isPending ? (
            <icons.Loading className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          <span>{t("buttons.save", { ns: "labels" })}</span>
        </Button>
      </DialogFooter>
    </>
  );
}
SortableWidgetList.displayName = "SortableWidgetList";

interface SortableWidgetItemProps extends WidgetItemProps {}
function SortableWidgetItem(props: SortableWidgetItemProps) {
  const { setNodeRef, attributes, listeners, transform, isDragging } =
    useSortable({
      id: props.widgetId,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
  };

  return (
    <WidgetItem
      ref={setNodeRef}
      draggableAttributes={attributes}
      draggableListeners={listeners}
      className={cn(isDragging ? "indicator" : undefined)}
      style={style}
      {...props}
    />
  );
}
SortableWidgetItem.displayName = "SortableWidgetItem";

interface WidgetItemProps extends React.ComponentPropsWithoutRef<"li"> {
  widgetId: string;
  isVisible: boolean;
  onToggleVisibility?: (widgetId: string) => void;
  draggableAttributes?: DraggableAttributes;
  draggableListeners?: DraggableSyntheticListeners;
}
const WidgetItem = React.forwardRef<HTMLLIElement, WidgetItemProps>(
  (props: WidgetItemProps, ref) => {
    const {
      widgetId,
      isVisible,
      className,
      onToggleVisibility,
      draggableAttributes,
      draggableListeners,
      ...rootProps
    } = props;

    const widgetName = useWidgetName(widgetId);

    return (
      <li
        ref={ref}
        className={cn(
          "grid w-full grid-cols-8 items-center bg-card p-1",
          "[&.indicator]:opacity-10",
          className
        )}
        {...rootProps}
      >
        <span>
          <button
            type="button"
            className="cursor-grab px-2 py-2"
            {...draggableAttributes}
            {...draggableListeners}
          >
            <icons.GripVertical className="h-4 w-4" />
          </button>
        </span>
        <p className="col-span-6">{widgetName}</p>
        <span className="inline-flex justify-end">
          <button
            type="button"
            className="px-2 py-2"
            onClick={() => onToggleVisibility?.(widgetId)}
          >
            {isVisible ? (
              <icons.EyeOn className="h-4 w-4" />
            ) : (
              <icons.EyeOff className="h-4 w-4" />
            )}
          </button>
        </span>
      </li>
    );
  }
);
WidgetItem.displayName = "WidgetItem";
