import React from "react";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

import { EmptyState } from "@/components/layouts/empty-state";
import { icons } from "@/components/ui/icons";

import type { TReportDetail, TReportResult } from "@/lib/schemas/report";

import { ExportToCsv } from "@/routes/_auth/reports/$reportId/-runner/plugin/export-to-csv";
import { GlobalFilter } from "@/routes/_auth/reports/$reportId/-runner/plugin/global-search";
import { ReportTable } from "@/routes/_auth/reports/$reportId/-runner/plugin/table";
import { ViewColumns } from "@/routes/_auth/reports/$reportId/-runner/plugin/view-columns";
import { useReportValueFormatter } from "@/routes/_auth/reports/$reportId/-runner/useReportValueFormatter";
import { useReportContext } from "@/routes/_auth/reports/$reportId/-runner/view-report-context";

import type { ReportTablePlugin } from "@/lib/types/report";

import { cn } from "@/lib/utils";

type OutputField = TReportDetail["outputFields"][number];

const KNOWN_REMOVAL_ACCESSORS = [
  "Amounts",
  "AmountIdle",
  "Totals",
  "TotalsName",
];

const CHART_WIDTH = 10;

const DefaultView = () => {
  const { t } = useTranslation();
  const {
    resultState: state,
    report,
    runReport,
    isPending,
  } = useReportContext();

  if (state.status !== "success") {
    throw new Error(
      'DefaultView should only be rendered when useReportContext().resultState.status is "success"'
    );
  }

  const data = React.useMemo(() => state.rows ?? [], [state.rows]);

  const format = useReportValueFormatter();

  // Extract the summary items from the data
  const sanitizedRows = React.useMemo(() => {
    const filteredSummaryItems = data.filter((row) => {
      const amountsPresent =
        (typeof row?.Amounts !== "undefined" && row?.Amounts !== null) ||
        (typeof row?.AmountIdle !== "undefined" && row?.AmountIdle !== null);
      const totalsPresent =
        (typeof row?.Totals !== "undefined" && row?.Totals !== null) ||
        (typeof row?.TotalsName !== "undefined" && row?.TotalsName !== null);
      return amountsPresent || totalsPresent;
    });

    // reconstruct the row object so that it does not contain the keys for the above summary items
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
        dataType: ["name", "note", "status"].some((key) =>
          accessor.toLowerCase().includes(key)
        )
          ? "string"
          : "decimal",
      }));

    // combine the output fields with the additional accessors
    // and perform any required calculations
    const outputFields = [...report.outputFields, ...additionalAccessors]
      .map((accessor) => {
        // calculate starting, min, and max sizing for the columns
        const rowValues = normalRows.map(
          (row) => String(row[accessor.name]).length
        );

        const cellSize = Math.max(...rowValues) * 10;
        const headerSize = Math.max(120, accessor.displayName.length * 10);

        const size = (cellSize < headerSize ? headerSize : cellSize) + 25;

        return {
          ...accessor,
          size,
        };
      })
      .sort((a, b) => a.displayOrder - b.displayOrder);

    return {
      rows: normalRows,
      summaryItems,
      outputFields,
    };
  }, [data, report.outputFields]);

  const topRowPlugins = React.useMemo(() => {
    const plugins: ReportTablePlugin[] = [];

    plugins.push(GlobalFilter);

    if (report.isExportableToExcel) {
      plugins.push(ExportToCsv);
    }

    plugins.push(ViewColumns); // this comes in last so it's on the right

    return plugins;
  }, [report.isExportableToExcel]);

  // create the column definitions
  const tableDefs = React.useMemo(() => {
    const columns: ColumnDef<TReportResult>[] = [];
    const visibility: VisibilityState = {};

    sanitizedRows.outputFields.forEach((field) => {
      // building the column definition
      const col: ColumnDef<TReportResult> = {
        id: field.name,
        header: field.displayName,
        accessorFn: (data) => data[field.name],
        cell: (info) => format(report.name, field, info.getValue() as any),
        size: field.size,
        minSize: 60,
        maxSize: field.size < 480 ? 480 : field.size * 1.5,
        sortingFn:
          field.dataType === "date" || field.dataType === "datetime"
            ? "datetime"
            : "auto",
        meta: {
          cellContentAlign: field.dataType === "decimal" ? "end" : undefined,
          columnName: field.displayName,
        },
      };
      columns.push(col);

      // building the visibility state
      visibility[field.name] = field.isVisible;
    });

    return { columns, visibility };
  }, [format, report.name, sanitizedRows.outputFields]);

  return (
    <section className="mx-2 mb-6 mt-4 sm:mx-4 sm:px-1">
      {state.status === "success" && sanitizedRows.rows.length === 0 ? (
        <EmptyState
          title={t("display.noResultsFound", { ns: "labels" })}
          subtitle={t("noResultsWereFoundForThisSearch", { ns: "messages" })}
          icon={icons.FolderEmpty}
          buttonOptions={{
            content: (
              <>
                {isPending ? (
                  <icons.Loading className="mr-2 h-3 w-3 animate-spin" />
                ) : (
                  <icons.Play className="mr-2 h-3 w-3" />
                )}
                Try again
              </>
            ),
            onClick: runReport,
          }}
          styles={{ containerClassName: cn("h-[650px]") }}
        />
      ) : (
        <ReportTable
          columnDefinitions={tableDefs.columns}
          columnVisibility={tableDefs.visibility}
          rows={sanitizedRows.rows}
          topRowPlugins={topRowPlugins}
        />
      )}
    </section>
  );
};

export default DefaultView;
