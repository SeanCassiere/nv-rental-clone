import { type TColumnHeaderItem } from "../schemas/client/column";

export function sortColOrderByOrderIndex(
  col1: TColumnHeaderItem,
  col2: TColumnHeaderItem
) {
  return col1.orderIndex - col2.orderIndex;
}
