import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { icons } from "@/components/ui/icons";
import { ScrollArea } from "@/components/ui/scroll-area";

import type { ReportTablePlugin } from "@/lib/types/report";

export const ViewColumns: ReportTablePlugin = (props) => {
  const { table, align } = props;

  const allLeafColumns = React.useMemo(
    () => table.getAllLeafColumns(),
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table.getAllLeafColumns()]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex h-8 w-full bg-card sm:w-fit"
        >
          <icons.Columns className="mr-2 h-4 w-4" />
          View
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
          {allLeafColumns.map((column) => {
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
