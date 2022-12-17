import type { ColumnListItemType } from "../types/Column";

export function sortColumnOrder(
  col1: ColumnListItemType,
  col2: ColumnListItemType
) {
  return col1.orderIndex - col2.orderIndex;
}
