import type { DashboardWidgetItemParsed } from "../schemas/dashboard";

/**
 * Sorts widgets by their user position.
 * @param {DashboardWidgetItemParsed} widgetA - The first widget to compare.
 * @param {DashboardWidgetItemParsed} widgetB - The second widget to compare.
 * @returns {number} - A negative number if widgetA should come before widgetB, a positive number if widgetB should come before widgetA, or 0 if they are equal.
 */
function widgetSortByUserPosition(
  widgetA: DashboardWidgetItemParsed,
  widgetB: DashboardWidgetItemParsed
) {
  return widgetA.widgetUserPosition - widgetB.widgetUserPosition;
}

function complexWidgetOrderByNewPositionList({
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
          .sort(widgetSortByUserPosition),
      ]
    : [...widgets].sort(widgetSortByUserPosition);
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

  return withOutDuplicates.sort(widgetSortByUserPosition);
}
export { widgetSortByUserPosition, complexWidgetOrderByNewPositionList };
