import React from "react";
import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { flexRender, type Cell, type Header } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { icons } from "@/components/ui/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { cn } from "@/lib/utils";

import { useTableList } from "./context";

interface TableListContentProps extends React.HTMLAttributes<HTMLDivElement> {}

function TableListContent(props: TableListContentProps) {
  const { className, ...divProps } = props;
  const { table, isLoading = false } = useTableList();

  const columnOrder = table.getState().columnOrder;

  const safeColumnOrderIds = table
    .getAllColumns()
    .filter((column) => !column.getCanSort() && !column.getCanHide())
    .map((column) => column.id);

  const rowModel = React.useMemo(
    () => table.getRowModel(),
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-compiler/react-compiler
    [table.getRowModel()]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (
      !over ||
      over.disabled ||
      active.id === over.id ||
      safeColumnOrderIds.includes(over.id as string)
    )
      return;

    table.setColumnOrder((currentColumnOrder) => {
      const oldIndex = currentColumnOrder.indexOf(active.id as string);
      const newIndex = currentColumnOrder.indexOf(over.id as string);
      return arrayMove(currentColumnOrder, oldIndex, newIndex);
    });
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className={cn("overflow-x-scroll", className)} {...divProps}>
      <DndContext
        collisionDetection={closestCorners}
        modifiers={[restrictToHorizontalAxis]}
        sensors={sensors}
        onDragEnd={handleDragEnd}
      >
        <Table className="text-base">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                <SortableContext
                  items={columnOrder}
                  strategy={horizontalListSortingStrategy}
                >
                  {headerGroup.headers.map((header) => (
                    <DraggableHeader key={header.id} header={header} />
                  ))}
                </SortableContext>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody
            className={cn(
              isLoading ? "pointer-events-none [&>*]:opacity-50" : ""
            )}
          >
            {rowModel.rows?.length ? (
              rowModel.rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <SortableContext
                      key={cell.id}
                      items={columnOrder}
                      strategy={horizontalListSortingStrategy}
                    >
                      <DragAlongCell key={cell.id} cell={cell} />
                    </SortableContext>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getVisibleLeafColumns().length}
                  className={cn(
                    "h-24 px-4",
                    table.getVisibleLeafColumns().length > 5
                      ? "text-left"
                      : "text-center"
                  )}
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DndContext>
    </div>
  );
}

export { TableListContent };

interface DraggableHeaderProps<TData, TValue> {
  header: Header<TData, TValue>;
}

function DraggableHeader<TData, TValue>({
  header,
}: DraggableHeaderProps<TData, TValue>) {
  // my hack to make the header not draggable if it can't be sorted or hidden
  const disabledReordering =
    !header.column.getCanSort() && !header.column.getCanHide();

  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: header.column.id,
      disabled: disabledReordering,
    });
  const style: React.CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition: "width transform 0.2s ease-in-out",
    whiteSpace: "nowrap",
    width: header.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  };

  if (disabledReordering) {
    return (
      <TableHead colSpan={header.colSpan} className={cn("whitespace-nowrap")}>
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
      </TableHead>
    );
  }

  return (
    <TableHead
      ref={setNodeRef}
      colSpan={header.colSpan}
      className={cn("whitespace-nowrap")}
      style={style}
    >
      <span className="mr-2">
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
      </span>
      <Button
        type="button"
        variant="ghost"
        className="h-8"
        {...attributes}
        {...listeners}
      >
        <icons.GripVertical className="h-3 w-3" />
      </Button>
    </TableHead>
  );
}

interface DragAlongCellProps<TData, TValue> {
  cell: Cell<TData, TValue>;
}

function DragAlongCell<TData, TValue>({
  cell,
}: DragAlongCellProps<TData, TValue>) {
  // my hack to make the cell not draggable if its header can't be sorted or hidden
  const disabledReordering =
    !cell.column.getCanSort() && !cell.column.getCanHide();

  const { isDragging, setNodeRef, transform } = useSortable({
    id: cell.column.id,
    disabled: disabledReordering,
  });

  const style: React.CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition: "width transform 0.2s ease-in-out",
    width: cell.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  };

  if (disabledReordering) {
    return (
      <TableCell ref={setNodeRef} className="whitespace-nowrap">
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </TableCell>
    );
  }

  return (
    <TableCell ref={setNodeRef} className="whitespace-nowrap" style={style}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  );
}
