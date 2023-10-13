import * as React from "react";

import type { ReportTablePlugin } from "@/types/report";

export const ExportToCsv: ReportTablePlugin = (props) => {
  const { table } = props;

  const onClick = React.useCallback(() => {
    const start = new Date();

    const columns = table
      .getAllFlatColumns()
      .map((col) => col.columnDef.header || "");
    const rows = table.getRowModel().rows.map((row) =>
      row.getVisibleCells().reduce((acc, info) => {
        const cellGetter = info.column.columnDef.cell;
        const value =
          typeof cellGetter === "function"
            ? cellGetter(info.getContext())
            : info.getValue();
        acc.push(value);
        return acc;
      }, [] as any[])
    );

    const end = new Date();
    const diff = end.getTime() - start.getTime();
    const diffInSeconds = diff / 1000;

    console.log("Start: Export to csv");
    console.table([
      ["Started at", start.toJSON()],
      ["Ended at", end.toJSON()],
      ["Time taken (seconds)", diffInSeconds],
      ["Rows processed", rows.length],
      ["Cells processed", rows.length * columns.length],
    ]);
    console.table([columns, ...rows]);
    console.log("End: Export to csv");
  }, [table]);

  return <button onClick={onClick}>Export to csv</button>;
};
