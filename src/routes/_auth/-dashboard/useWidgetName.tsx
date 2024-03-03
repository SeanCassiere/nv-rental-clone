import * as React from "react";

/**
 * @todo integrate with i18next
 */
export function useWidgetName(widgetId: string) {
  switch (widgetId) {
    case "VehicleStatus":
      return "Fleet status";
    case "SalesStatus":
      return "Sales status";
    case "QuickLookup":
      return "Quick lookup";
    case "QuickCheckin":
      return "Quick rental checkin";
    default:
      return widgetId;
  }
}
