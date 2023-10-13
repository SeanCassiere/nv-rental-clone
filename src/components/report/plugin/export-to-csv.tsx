import * as React from "react";
import { SheetIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useReportContext } from "@/hooks/context/view-report";

import type { ReportTablePlugin } from "@/types/report";

import { downloadDataToCsv, sanitizeFilename } from "@/utils";

export const ExportToCsv: ReportTablePlugin = (props) => {
  const { table, align } = props;
  const { report } = useReportContext();

  const inputId = React.useId();

  const [open, onOpenChange] = React.useState(false);
  const [userFilename, setUserFilename] = React.useState(
    report.name ?? "report"
  );

  const download = React.useCallback(() => {
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

    onOpenChange(false);
    setUserFilename(report.name ?? "report");
  }, [table, userFilename, report.name]);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex h-8 w-full sm:w-fit"
        >
          <SheetIcon className="mr-2 h-4 w-4" />
          Export to CSV
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align} className="w-full sm:max-w-[16rem]">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Export to CSV</h4>
            <p className="text-sm text-muted-foreground">
              Confirm the filename and click the download button.
            </p>
          </div>
          <div className="grid gap-3">
            <Label htmlFor={inputId} className="sr-only">
              Filename
            </Label>
            <div className="grid items-center">
              <Input
                id={inputId}
                className="h-8"
                value={userFilename}
                onChange={(evt) => {
                  setUserFilename(evt.target.value);
                }}
              />
            </div>
            <Button type="button" onClick={download}>
              Download
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
