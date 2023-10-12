import React from "react";

import { useReportContext } from "@/hooks/context/view-report";

const DefaultView = () => {
  const { resultState: state } = useReportContext();

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
    const normalRows = data.filter(
      (row) => !filteredSummaryItems.includes(row)
    );

    const summaryItems = filteredSummaryItems.map((row) => ({
      value: row?.Amounts ?? row?.AmountIdle ?? 0,
      name: row?.Totals ?? row?.TotalsName ?? "-",
    }));

    return {
      rows: normalRows,
      summaryItems,
    };
  }, [data]);

  return (
    <section className="mx-2 mt-4 sm:mx-4 sm:px-1">DefaultReportView</section>
  );
};

export default DefaultView;
