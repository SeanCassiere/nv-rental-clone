import React from "react";
import { type Table } from "@tanstack/react-table";

type TableListContextType<TData = any> = {
  table: Table<TData>;
  isLoading?: boolean;
};

const tableListContext = React.createContext<TableListContextType | null>(null);

function useTableList<TData = unknown>() {
  const context = React.useContext(tableListContext);
  if (!context) {
    throw new Error("useTableListContext must be used within a TableList");
  }
  return context as TableListContextType<TData>;
}

export { tableListContext, useTableList };
