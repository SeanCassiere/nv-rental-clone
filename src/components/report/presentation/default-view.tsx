import React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { useReportContext } from "@/hooks/context/view-report";

import type { TReportResult } from "@/schemas/report";

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
    const knownAccessors = report.outputFields.map((field) => field.name);

    // remove the known accessors from the normal row accessors
    const additionalAccessors = normalRowAccessors.filter(
      (accessor) => !knownAccessors.includes(accessor)
    );

    return {
      rows: normalRows,
      summaryItems,
      additionalAccessors,
    };
  }, [data, report.outputFields]);

  console.log("sanitizedRows", sanitizedRows);

  const columnDefs = React.useMemo(() => {}, []);

  return (
    <section className="mx-2 mt-4 sm:mx-4 sm:px-1">DefaultReportView</section>
  );
};

export default DefaultView;
