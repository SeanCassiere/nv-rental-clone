import React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { useReportContext } from "@/hooks/context/view-report";

import type { TReportDetail, TReportResult } from "@/schemas/report";

type OutputField = TReportDetail["outputFields"][number];

const KNOWN_REMOVAL_ACCESSORS = [
  "Amounts",
  "AmountIdle",
  "Totals",
  "TotalsName",
];

const DefaultView = () => {
  const { resultState: state, report } = useReportContext();

  if (state.status !== "success") {
    throw new Error(
      'DefaultView should only be rendered when useReportContext().resultState.status is "success"'
    );
  }

  const data = React.useMemo(() => state.rows ?? [], [state.rows]);

  // Extract the summary items from the data
  const sanitizedRows = React.useMemo(() => {
    const filteredSummaryItems = data.filter((row) => {
      const amountsPresent =
        (typeof row?.Amounts !== "undefined" && row?.Amounts !== null) ||
        (typeof row?.AmountIdle !== "undefined" && row?.AmountIdle !== null);
      const totalsPresent =
        (typeof row?.Totals !== "undefined" && row?.Totals !== null) ||
        (typeof row?.TotalsName !== "undefined" && row?.TotalsName !== null);
      return amountsPresent && totalsPresent;
    });

    // should not contain the above summary items
    const normalRows = data
      .filter((row) => !filteredSummaryItems.includes(row))
      .map(
        (
          row // remove the known accessors from the normal row accessors
        ) =>
          Object.entries(row).reduce((acc, [key, value]) => {
            if (KNOWN_REMOVAL_ACCESSORS.includes(key)) return acc;
            acc[key] = value;
            return acc;
          }, {} as TReportResult)
      );

    // should only contain the above summary items mapped to the correct format
    const summaryItems = filteredSummaryItems.map((row) => ({
      value: row?.Amounts ?? row?.AmountIdle ?? 0,
      name: row?.Totals ?? row?.TotalsName ?? "-",
    }));

    // extra accessors from the normal rows
    const normalRowAccessors = Object.keys(normalRows[0] ?? {});
    const outputAccessors = report.outputFields.map((field) => field.name);
    const outputAccessorsLength = outputAccessors.length;

    // remove the known accessors from the normal row accessors
    const additionalAccessors: OutputField[] = normalRowAccessors
      .filter((accessor) => !outputAccessors.includes(accessor))
      .map((accessor, idx) => ({
        name: accessor,
        displayName: accessor,
        isVisible: true,
        displayOrder: outputAccessorsLength + idx + 1,
        dataType: "integer",
      }));

    return {
      rows: normalRows,
      summaryItems,
      additionalAccessors,
    };
  }, [data, report.outputFields]);

  // create the column definitions
  const columnDefs = React.useMemo(() => {
    const columns: ColumnDef<TReportResult>[] = [];

    report.outputFields.forEach((field) => {
      const col: ColumnDef<TReportResult> = {
        id: field.name,
        header: field.displayName,
        accessorFn: (row) => row[field.name],
      };
      columns.push(col);
    });

    sanitizedRows.additionalAccessors.forEach((field) => {
      const col: ColumnDef<TReportResult> = {
        id: field.name,
        header: field.displayName,
        accessorFn: (row) => row[field.name],
      };
      columns.push(col);
    });

    return columns;
  }, [report.outputFields, sanitizedRows.additionalAccessors]);

  console.log("columnDefs", columnDefs);

  return (
    <section className="mx-2 mt-4 sm:mx-4 sm:px-1">DefaultReportView</section>
  );
};

export default DefaultView;
