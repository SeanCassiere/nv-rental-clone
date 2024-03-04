import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Button } from "@/components/ui/button";
import { icons } from "@/components/ui/icons";

import type { DashboardWidgetItemParsed } from "@/lib/schemas/dashboard";
import type { Auth } from "@/lib/query/helpers";

import { useWidgetName } from "@/routes/_auth/-dashboard/useWidgetName";

import { cn } from "@/lib/utils";

import { CommonWidgetProps } from "./widgets/_common";

const SalesStatusWidget = React.lazy(() => import("./widgets/sales-status"));
const VehicleStatusWidget = React.lazy(
  () => import("./widgets/vehicle-status")
);
const QuickCheckinAgreementWidget = React.lazy(
  () => import("./widgets/quick-checkin-agreement")
);
const QuickLookupWidget = React.lazy(() => import("./widgets/quick-lookup"));

interface WidgetFacadeProps extends Auth {
  widget: DashboardWidgetItemParsed;
  selectedLocationIds: string[];
}

export function WidgetFacade(props: WidgetFacadeProps) {
  const { widget } = props;

  const { setNodeRef, attributes, listeners, isDragging, transform } =
    useSortable({
      id: widget.widgetID,
    });

  const style: React.CSSProperties = {
    position: "relative",
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition: "width transform 0.2s ease-in-out",
    whiteSpace: "nowrap",
    width: widget.widgetScale > 6 ? "100%" : "auto",
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "col-span-1 flex flex-col rounded-md border bg-card p-4 shadow-sm",
        props.widget.widgetScale > 6 ? "md:col-span-12" : "md:col-span-6"
      )}
    >
      <React.Suspense fallback={null}>
        <RenderWidget
          auth={props.auth}
          widgetId={props.widget.widgetID}
          selectedLocationIds={props.selectedLocationIds}
          draggableAttributes={attributes}
          draggableListeners={listeners}
        />
      </React.Suspense>
    </li>
  );
}

function RenderWidget(props: CommonWidgetProps) {
  switch (props.widgetId) {
    case "SalesStatus":
      return <SalesStatusWidget {...props} />;
    case "VehicleStatus":
      return <VehicleStatusWidget {...props} />;
    case "QuickCheckin":
      return <QuickCheckinAgreementWidget {...props} />;
    case "QuickLookup":
      return <QuickLookupWidget {...props} />;
    default:
      return <NoWidgetAvailable {...props} />;
  }
}

function NoWidgetAvailable(props: CommonWidgetProps) {
  const widgetName = useWidgetName(props.widgetId);
  return (
    <React.Fragment>
      <div className="flex max-h-8 shrink-0 items-center justify-between gap-2">
        <span>{widgetName}</span>
        <Button
          type="button"
          variant="ghost"
          className="h-8"
          {...props.draggableAttributes}
          {...props.draggableListeners}
        >
          <icons.GripVertical className="h-3 w-3" />
        </Button>
      </div>
      <div>No widget available for "{widgetName}".</div>
    </React.Fragment>
  );
}
