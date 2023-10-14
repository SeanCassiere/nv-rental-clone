import * as React from "react";
import { Columns as MixerHorizontalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

import type { ReportTablePlugin } from "@/types/report";

export const ViewColumns: ReportTablePlugin = (props) => {
  const { table, align } = props;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex h-8 w-full sm:w-fit"
        >
          <MixerHorizontalIcon className="mr-2 h-4 w-4" />
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className="w-full sm:max-w-[16rem]"
        onCloseAutoFocus={(evt) => evt.preventDefault()}
      >
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={table.getIsAllColumnsVisible()}
          onCheckedChange={(value) => table.toggleAllColumnsVisible(!!value)}
          onSelect={(evt) => evt.preventDefault()}
        >
          All
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <ScrollArea className="h-80">
          {table.getAllLeafColumns().map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                onSelect={(evt) => evt.preventDefault()}
                disabled={!column.getCanHide()}
              >
                {column.columnDef?.meta?.columnName ?? column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
