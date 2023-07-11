import { type TColumnListItemParsed } from "./schemas/column";

export function sortColOrderByOrderIndex(
  col1: TColumnListItemParsed,
  col2: TColumnListItemParsed,
) {
  return col1.orderIndex - col2.orderIndex;
}
