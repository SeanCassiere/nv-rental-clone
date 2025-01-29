import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useDebounce } from "@/lib/hooks/useDebounce";

import type { ReportTablePlugin } from "@/lib/types/report";

export const GlobalFilter: ReportTablePlugin = (props) => {
  const { table } = props;

  const filterValue = table.getState().globalFilter ?? "";

  const [input, setInput] = React.useState(() => filterValue);

  const searchValue = useDebounce(input, 250);

  React.useEffect(() => {
    setInput(filterValue);
  }, [table, filterValue]);

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
        className="bg-card h-8"
      />
    </div>
  );
};
