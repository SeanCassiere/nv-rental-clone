import * as React from "react";
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
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type Cell,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnOrderState,
  type Header,
  type OnChangeFn,
  type PaginationState,
  type VisibilityState,
} from "@tanstack/react-table";

import type { PrimaryModuleTableFacetedFilterItem } from "@/components/primary-module/table-filter";
import { PrimaryModuleTableToolbar } from "@/components/primary-module/table-toolbar";
import { Button } from "@/components/ui/button";
import { icons } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getPaginationWithDoubleEllipsis } from "@/lib/utils/pagination";

import { cn } from "@/lib/utils";

interface PrimaryModuleTableProps<
  TData,
  TValue,
  TColumnFilters extends ColumnFiltersState,
> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  isLoading?: boolean;

  onColumnOrderChange?: (updatedValues: ColumnOrderState) => void;

  initialColumnVisibility?: VisibilityState;
  onColumnVisibilityChange?: (visibilityGraph: VisibilityState) => void;

  pagination: PaginationState;
  onPaginationChange: (pagination: PaginationState) => void;
  totalPages: number;

  filters: {
    columnFilters: TColumnFilters;
    setColumnFilters: OnChangeFn<ColumnFiltersState>;
    onClearFilters: () => void;
    onSearchWithFilters: () => void;
    filterableColumns?: PrimaryModuleTableFacetedFilterItem[];
  };
}

export function PrimaryModuleTable<
  TData,
  TValue,
  TColumnFilters extends ColumnFiltersState,
>(props: PrimaryModuleTableProps<TData, TValue, TColumnFilters>) {
  const {
    columnFilters,
    setColumnFilters,
    filterableColumns = [],
    onClearFilters,
    onSearchWithFilters,
  } = props.filters;

  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>(() =>
    props.columns.map((column) => column.id!)
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(props.initialColumnVisibility ?? {});

  const table = useReactTable({
    data: props.data,
    columns: props.columns,
    manualPagination: true,
    pageCount: props.totalPages,
    state: {
      columnOrder,
      columnVisibility,
      pagination: props.pagination,
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),

    manualFiltering: true,
    onColumnFiltersChange: setColumnFilters,

    onColumnOrderChange: (updater) => {
      const newColumnOrdering =
        typeof updater === "function" ? updater(columnOrder) : updater;
      setColumnOrder(newColumnOrdering);
      props?.onColumnOrderChange?.(newColumnOrdering);
    },
    onColumnVisibilityChange: (updater) => {
      const newColumnVisibility =
        typeof updater === "function" ? updater(columnVisibility) : updater;
      setColumnVisibility(newColumnVisibility);
      props?.onColumnVisibilityChange?.(newColumnVisibility);
    },
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function" ? updater(props.pagination) : updater;
      props?.onPaginationChange?.(newPagination);
    },
  });

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const safeColumnOrderIds = React.useMemo(
    () =>
      table
        .getAllColumns()
        .filter((column) => !column.getCanSort() && !column.getCanHide())
        .map((column) => column.id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table.getAllColumns()]
  );

  const handleDndDragEnd = (event: DragEndEvent) => {
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

  const pageNumbers = React.useMemo(
    () =>
      getPaginationWithDoubleEllipsis(
        props.pagination.pageIndex + 1,
        props.totalPages,
        7
      ),
    [props.pagination.pageIndex, props.totalPages]
  );

  return (
    <div className="space-y-4">
      <PrimaryModuleTableToolbar
        table={table}
        filterableColumns={filterableColumns}
        onClearFilters={onClearFilters}
        onSearchWithFilters={onSearchWithFilters}
      />
      <Separator className="mt-3.5" />
      <div className="overflow-hidden rounded border">
        <div className="overflow-x-auto bg-background">
          <DndContext
            collisionDetection={closestCorners}
            modifiers={[restrictToHorizontalAxis]}
            onDragEnd={handleDndDragEnd}
            sensors={sensors}
          >
            <Table className="table-auto bg-card text-base">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    <SortableContext
                      items={columnOrder}
                      strategy={horizontalListSortingStrategy}
                    >
                      {headerGroup.headers.map((header) => (
                        <DraggablePrimaryModuleTableHeader
                          key={header.id}
                          header={header}
                        />
                      ))}
                    </SortableContext>
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody
                className={cn(
                  props?.isLoading ? "pointer-events-none [&>*]:opacity-50" : ""
                )}
              >
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
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
                          <DraggablePrimaryModuleTableCell
                            key={cell.id}
                            cell={cell}
                          />
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
        {/* pagination */}
      </div>
      <div className="flex flex-1 justify-between px-2 sm:hidden">
        <Button
          variant="outline"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
        >
          Next
        </Button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <nav className="isolate inline-flex space-x-1" aria-label="Pagination">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-l px-2 tabular-nums"
          >
            <icons.ChevronLeft
              className="mr-1 h-3.5 w-3.5"
              aria-hidden="true"
            />
            <span className="text-sm">Previous</span>
          </Button>
          {pageNumbers.map((pageNum, idx) => {
            const current = Boolean(props.pagination.pageIndex + 1 === pageNum);
            return (
              <Button
                key={`module-table-pagination-button-${pageNum}-${idx}`}
                variant={current ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  !isNaN(pageNum) && table.setPageIndex(pageNum - 1);
                }}
                disabled={isNaN(pageNum)}
                className="tabular-nums"
                {...(current
                  ? { "aria-current": "page", current: `${current}` }
                  : {})}
              >
                {!isNaN(pageNum) ? pageNum : "..."}
              </Button>
            );
          })}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-r px-2 tabular-nums"
          >
            <span className="ml-1.5 text-sm">Next</span>
            <icons.ChevronRight
              className="ml-1 h-3.5 w-3.5"
              aria-hidden="true"
            />
          </Button>
        </nav>
      </div>
    </div>
  );
}

interface DraggablePrimaryModuleTableHeaderProps<TData, TValue> {
  header: Header<TData, TValue>;
}

function DraggablePrimaryModuleTableHeader<TData, TValue>({
  header,
}: DraggablePrimaryModuleTableHeaderProps<TData, TValue>) {
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

interface DraggablePrimaryModuleTableCellProps<TData, TValue> {
  cell: Cell<TData, TValue>;
}

function DraggablePrimaryModuleTableCell<TData, TValue>({
  cell,
}: DraggablePrimaryModuleTableCellProps<TData, TValue>) {
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
