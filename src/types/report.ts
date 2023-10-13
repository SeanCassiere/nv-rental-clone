import type { Table } from "@tanstack/react-table";

import type { TReportResult } from "@/schemas/report";

export type ReportFilterOption = {
  display: string;
  value: string;
};

export type ReportTablePlugin = (props: {
  table: Table<TReportResult>;
  align: "start" | "center" | "end";
}) => JSX.Element | null;
