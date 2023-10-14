import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useDebounce } from "@/hooks/internal/useDebounce";

import type { ReportTablePlugin } from "@/types/report";

export const GlobalFilter: ReportTablePlugin = (props) => {
  const { table } = props;

  const [input, setInput] = React.useState(
    () => table.getState().globalFilter ?? ""
  );

  const searchValue = useDebounce(input, 250);

  React.useEffect(() => {
    const value = table.getState().globalFilter ?? "";
    setInput(value);
  }, [table]);

  React.useEffect(() => {
    table.setGlobalFilter(searchValue);
  }, [table, searchValue]);

  return (
    <div className="w-full sm:w-60">
      <Label className="sr-only">Global filter</Label>
      <Input
        type="search"
        placeholder="Filter..."
        value={input}
        onChange={(evt) => setInput(evt.target.value)}
        className="h-8"
      />
    </div>
  );
};
