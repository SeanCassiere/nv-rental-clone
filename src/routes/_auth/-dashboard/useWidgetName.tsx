import * as React from "react";
import { useTranslation } from "react-i18next";

/**
 * @todo integrate with i18next
 */
export function useWidgetName(widgetId: string) {
  const { t } = useTranslation();

  switch (widgetId) {
    case "VehicleStatus":
      return t("widgets.vehicleStatus", { ns: "dashboard" });
    case "SalesStatus":
      return t("widgets.salesStatus", { ns: "dashboard" });
    case "QuickLookup":
      return t("widgets.quickLookup", { ns: "dashboard" });
    case "QuickCheckin":
      return t("widgets.quickCheckin", { ns: "dashboard" });
    default:
      return widgetId;
  }
}
