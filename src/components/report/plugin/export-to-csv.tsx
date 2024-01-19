import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";

import type { ReportTablePlugin } from "@/types/report";

import { useReportContext } from "@/context/view-report";
import { downloadDataToCsv, sanitizeFilename } from "@/utils";

const DEFAULT_NAME = "report";
const ALL = "all";
const FILTERED = "filtered";

export const ExportToCsv: ReportTablePlugin = (props) => {
  const { table, align } = props;
  const { report } = useReportContext();

  const columnFilters = table.getState().columnFilters;
  const globalFilter = table.getState().globalFilter;

  const isFiltered = React.useMemo(() => {
    const hasColumnFilters = columnFilters.length > 0;
    const hasGlobalFilter = (globalFilter || "") !== "";
    return hasColumnFilters || hasGlobalFilter;
  }, [columnFilters, globalFilter]);

  const [open, onOpenChange] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(z.object({ filename: z.string(), mode: z.string() })),
    values: {
      filename: report.name || DEFAULT_NAME,
      mode: isFiltered ? FILTERED : ALL,
    },
  });

  const download = React.useCallback(
    ({ userFilename, mode }: { userFilename: string; mode: string }) => {
      const columns = table
        .getAllFlatColumns()
        .map((col) => col.columnDef.header || "");

      let rows: any[][] = [];

      if (mode === "all") {
        const allRows = table.getCoreRowModel().rows.map((row) =>
          row.getAllCells().reduce((acc, info) => {
            const cellGetter = info.column.columnDef.cell;
            const value =
              typeof cellGetter === "function"
                ? cellGetter(info.getContext())
                : info.getValue();
            acc.push(value);
            return acc;
          }, [] as any[])
        );
        rows = allRows;
      }

      if (mode === "filtered") {
        const filteredRows = table.getRowModel().rows.map((row) =>
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
        rows = filteredRows;
      }

      const now = new Date();

      const reportName = sanitizeFilename(userFilename || DEFAULT_NAME);
      const filename = `${reportName}-${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}`;

      downloadDataToCsv([columns, ...rows], filename);

      onOpenChange(false);
      form.setValue("filename", report.name || DEFAULT_NAME);
    },
    [table, form, report.name]
  );

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex h-8 w-full sm:w-fit"
        >
          <icons.Sheet className="mr-2 h-4 w-4" />
          Export to CSV
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align} className="w-full sm:max-w-[16rem]">
        <Form {...form}>
          <form
            className="grid gap-4"
            onSubmit={form.handleSubmit((values) => {
              download({ userFilename: values.filename, mode: values.mode });
            })}
          >
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Export to CSV</h4>
              <p className="text-sm text-muted-foreground">
                Confirm the filename and click the download button.
              </p>
            </div>
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="filename"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="sr-only">Filename</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Filename..."
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              {isFiltered && (
                <FormField
                  control={form.control}
                  name="mode"
                  render={({ field }) => (
                    <FormItem className="flex w-full items-center gap-4 space-y-0">
                      <FormControl>
                        <Switch
                          checked={field.value === FILTERED}
                          onCheckedChange={(checked) =>
                            field.onChange(checked ? FILTERED : ALL)
                          }
                        />
                      </FormControl>
                      <FormLabel className="m-0 flex items-center">
                        {field.value === "filtered"
                          ? "Filtered rows"
                          : "All rows"}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              )}
              <Button type="submit">Download</Button>
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
};
