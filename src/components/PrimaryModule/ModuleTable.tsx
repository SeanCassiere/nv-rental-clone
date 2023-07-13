import { useMemo, useState } from "react";
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  type ColumnOrderState,
  type ColumnDef,
  type PaginationState,
  type VisibilityState,
  type Column,
} from "@tanstack/react-table";
import {
  DndContext,
  useSensors,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  closestCorners,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import {
  SortAsc,
  SortDesc,
  EyeOff,
  GripVertical,
  ChevronsDownUp,
} from "lucide-react";

import { ChevronLeftOutline, ChevronRightOutline } from "../icons";

import { type TColumnListItemParsed } from "../../utils/schemas/column";
import { sortColOrderByOrderIndex } from "../../utils/ordering";
import { getPaginationWithDoubleEllipsis } from "../../utils/pagination";
import { cn } from "@/utils";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableToolbar } from "@/components/ui/data-table";

interface ModuleTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  rawColumnsData: TColumnListItemParsed[];

  onColumnOrderChange?: (updatedValues: ColumnOrderState) => void;

  onColumnVisibilityChange?: (visibilityGraph: VisibilityState) => void;

  pagination: PaginationState;
  onPaginationChange: (pagination: PaginationState) => void;
  totalPages: number;
}

export function ModuleTable<T extends any>(props: ModuleTableProps<T>) {
  const [columns] = useState([...props.columns]);

  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    columns.map((col) => col.id!)
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    props.rawColumnsData
      .sort(sortColOrderByOrderIndex)
      .reduce(
        (acc, col) => ({ ...acc, [col.columnHeader]: col.isSelected }),
        {}
      )
  );

  const table = useReactTable({
    data: props.data,
    columns: props.columns,
    manualPagination: true,
    pageCount: props.totalPages,
    state: {
      columnOrder,
      columnVisibility,
      pagination: props.pagination,
    },
    getCoreRowModel: getCoreRowModel(),
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

  const handleDndDragEnd = (evt: DragEndEvent) => {
    if (!evt.over || evt.over.disabled || evt.active.id === evt.over.id) return;

    const draggingId = evt.active.id;
    const overId = evt.over.id;
    const newOrder = arrayMove(
      columnOrder,
      columnOrder.indexOf(draggingId as string),
      columnOrder.indexOf(overId as string)
    );
    table.setColumnOrder(newOrder);
  };

  const pageNumbers = useMemo(
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
      <DataTableToolbar table={table} />
      <div className="overflow-hidden rounded border">
        {/* {showExtraActions && (
        <div className="flex w-[100%] items-center justify-end bg-slate-100 px-4 pt-3 pb-1.5">
          {props.showColumnPicker && (
            <ColumnPickerPopover
              table={table}
              getColumnDescriptionFn={getColumnDescription}
              columnVisibility={columnVisibility}
              lockedColumns={lockedColumns}
              onColumnVisibilityChange={props.onColumnVisibilityChange}
            />
          )}
        </div>
      )} */}
        <div className="overflow-x-auto bg-background">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={handleDndDragEnd}
            modifiers={[restrictToHorizontalAxis]}
          >
            <Table className="table-auto">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    <SortableContext
                      items={columnOrder}
                      strategy={horizontalListSortingStrategy}
                    >
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </SortableContext>
                  </TableRow>
                ))}
                {/* {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    <SortableContext
                      items={columnOrder}
                      strategy={horizontalListSortingStrategy}
                    >
                      {headerGroup.headers.map((header) => (
                        <DraggableColumnHeader
                          key={header.id}
                          header={header}
                          isLocked={lockedColumns.includes(header.id)}
                        />
                      ))}
                    </SortableContext>
                  </TableRow>
                ))} */}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell className="whitespace-nowrap" key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
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
            className="rounded-l px-2 [font-variant-numeric:tabular-nums]"
          >
            <span className="sr-only">Previous</span>
            <ChevronLeftOutline className="h-4 w-4" aria-hidden="true" />
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
                className="[font-variant-numeric:tabular-nums]"
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
            className="rounded-r px-2 [font-variant-numeric:tabular-nums]"
          >
            <span className="sr-only">Next</span>
            <ChevronRightOutline className="h-4 w-4" aria-hidden="true" />
          </Button>
        </nav>
      </div>
    </div>
  );
}

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function ModuleTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const disabled = !column.getCanHide();

  const {
    attributes,
    listeners,
    transform,
    transition,
    setNodeRef,
    setActivatorNodeRef,
  } = useSortable({
    id: column.id,
    disabled,
  });

  if (!column.getCanSort() && !column.getCanHide()) {
    return (
      <div
        className={cn(
          "flex items-center space-x-0.5 whitespace-nowrap text-left",
          className
        )}
      >
        {title}
      </div>
    );
  }

  return (
    <div
      ref={!disabled ? setNodeRef : undefined}
      className={cn("flex items-center space-x-0.5", className)}
      style={{ transform: CSS.Translate.toString(transform), transition }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="sm"
            className="-ml-3 h-8 whitespace-nowrap text-left data-[state=open]:bg-accent"
          >
            <span>{title}</span>
            {column.getCanSort() ? (
              <>
                {column.getIsSorted() === "desc" ? (
                  <SortDesc className="ml-2 h-3 w-3" />
                ) : column.getIsSorted() === "asc" ? (
                  <SortAsc className="ml-2 h-3 w-3" />
                ) : (
                  <ChevronsDownUp className="ml-2 h-3 w-3" />
                )}
              </>
            ) : (
              <>
                <ChevronsDownUp className="ml-2 h-3 w-3" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {column.getCanSort() && (
            <>
              <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                <SortAsc className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                Asc
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                <SortDesc className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                Desc
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        size="sm"
        variant="ghost"
        ref={setActivatorNodeRef}
        {...listeners}
        {...attributes}
      >
        <GripVertical className="h-3 w-3" />
      </Button>
    </div>
  );
}

export function ModuleTableCellWrap({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex min-w-[80px] justify-start">{children}</div>;
}
