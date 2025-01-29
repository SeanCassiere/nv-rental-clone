import type React from "react";
import type { Table } from "@tanstack/react-table";

export type ReportFilterOption = {
  display: string;
  value: string;
};

export type ReportTablePlugin = <TData>(props: {
  table: Table<TData>;
  align: "start" | "center" | "end";
}) => React.JSX.Element | null;
