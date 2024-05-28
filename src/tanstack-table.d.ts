import "@tanstack/react-table";

import { RankingInfo } from "@tanstack/match-sorter-utils";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    columnName?: string;
    cellContentAlign?: "start" | "center" | "end";
  }

  interface FilterMeta {
    itemRank?: RankingInfo;
  }
}
