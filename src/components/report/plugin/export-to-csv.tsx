import * as React from "react";

import { useReportContext } from "@/hooks/context/view-report";

import type { ReportTablePlugin } from "@/types/report";

import { downloadDataToCsv, sanitizeFilename } from "@/utils";

export const ExportToCsv: ReportTablePlugin = (props) => {
  const { table } = props;
  const { report } = useReportContext();

  const [userFilename] = React.useState(
    sanitizeFilename(report.name ?? "report")
  );

  const onClick = React.useCallback(() => {
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

    const now = new Date();

    const reportName = sanitizeFilename(userFilename);
    const filename = `${reportName}-${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}`;

    downloadDataToCsv([columns, ...rows], filename);
  }, [table, userFilename]);

  return <button onClick={onClick}>Export to csv</button>;
};
