import * as React from "react";

import type { ReportTablePlugin } from "@/types/report";

export const exportToCsv: ReportTablePlugin = ({ table }) => {
  const columns = table
    .getAllFlatColumns()
    .map((col) => col.columnDef.header || "");
  const rows = table.getRowModel().rows.map((row) =>
    row.getVisibleCells().reduce((acc, curr) => {
      const value = curr.getValue() as string;
      acc.push(value);
      return acc;
    }, [] as string[])
  );

  const onClick = () => {
    console.log("columns", columns);
    console.log(
      "dummy csv\n",
      [columns.join(","), rows.map((list) => list.join(","))].join("\n")
    );
  };
  return <button onClick={onClick}>Export to csv</button>;
};
