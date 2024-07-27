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

import { useTableList } from "./context";

function TableListColumnVisibilityDropdown() {
  const { table } = useTableList();

  const columns = React.useMemo(
    () => table.getAllColumns(),
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-compiler/react-compiler
    [table.getAllColumns()]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex h-8 bg-card">
          <icons.Columns className="mr-2 h-4 w-4" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-full sm:max-w-[16rem]"
        onCloseAutoFocus={(evt) => evt.preventDefault()}
      >
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          className="capitalize"
          checked={table.getIsAllColumnsVisible()}
          onCheckedChange={(value) => table.toggleAllColumnsVisible(!!value)}
          onSelect={(evt) => evt.preventDefault()}
        >
          All
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <ScrollArea className="h-80">
          {columns
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide()
            )
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  onSelect={(evt) => evt.preventDefault()}
                >
                  {column.columnDef?.meta?.columnName ?? column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { TableListColumnVisibilityDropdown };
