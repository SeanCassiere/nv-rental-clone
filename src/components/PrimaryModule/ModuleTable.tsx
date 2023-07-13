import {
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type DetailedHTMLProps,
} from "react";
import { usePopper } from "react-popper";
import { Popover } from "@headlessui/react";
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  type Table as TanstackTableType,
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
  CircleDashed,
  GripVertical,
} from "lucide-react";

import {
  ChevronLeftOutline,
  ChevronRightOutline,
  EyeSlashOutline,
} from "../icons";

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
                  <SortDesc className="ml-2 h-4 w-4" />
                ) : column.getIsSorted() === "asc" ? (
                  <SortAsc className="ml-2 h-4 w-4" />
                ) : (
                  <CircleDashed className="ml-2 h-4 w-4" />
                )}
              </>
            ) : (
              <>
                <CircleDashed className="ml-2 h-4 w-4" />
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

interface ModuleTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  rawColumnsData: TColumnListItemParsed[];
  lockedColumns?: (keyof T)[];

  onColumnOrderChange?: (updatedValues: ColumnOrderState) => void;

  onColumnVisibilityChange?: (visibilityGraph: VisibilityState) => void;

  pagination: PaginationState;
  onPaginationChange: (pagination: PaginationState) => void;
  totalPages: number;

  showColumnPicker?: boolean;
}

export function ModuleTable<T extends any>(props: ModuleTableProps<T>) {
  const lockedColumns = (props.lockedColumns || []) as string[];

  const showExtraActions = props.showColumnPicker;

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
    <>
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
      <div className="flex flex-1 justify-between px-2 py-2.5 sm:hidden">
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
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between sm:py-3.5">
        <nav className="isolate inline-flex space-x-1" aria-label="Pagination">
          <DesktopPaginationBtn
            className="rounded-l px-2"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <span className="sr-only">Previous</span>
            <ChevronLeftOutline className="h-4 w-4" aria-hidden="true" />
          </DesktopPaginationBtn>
          {pageNumbers.map((pageNum, idx) => (
            <DesktopPaginationBtn
              key={`module-table-pagination-button-${pageNum}-${idx}`}
              disabled={isNaN(pageNum)}
              onClick={() => {
                !isNaN(pageNum) && table.setPageIndex(pageNum - 1);
              }}
              current={Boolean(props.pagination.pageIndex + 1 === pageNum)}
            >
              {!isNaN(pageNum) ? pageNum : "..."}
            </DesktopPaginationBtn>
          ))}
          <DesktopPaginationBtn
            className="rounded-r px-2"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            <span className="sr-only">Next</span>
            <ChevronRightOutline className="h-4 w-4" aria-hidden="true" />
          </DesktopPaginationBtn>
        </nav>
      </div>
    </>
  );
}

export default ModuleTable;

const ColumnPickerPopover = <T extends any>({
  table,
  getColumnDescriptionFn: getColumnDescription,
  onColumnVisibilityChange,
  columnVisibility,
  lockedColumns = [],
}: {
  table: TanstackTableType<T>;
  getColumnDescriptionFn: (headerName: string) => string | null;
  onColumnVisibilityChange?: ModuleTableProps<T>["onColumnVisibilityChange"];
  columnVisibility: VisibilityState;
  lockedColumns?: string[];
}) => {
  const [hasVisibilityChanges, setHasVisibilityChanges] = useState(false);

  const [popperButtonEl, setPopperButtonEl] = useState<any>();
  const [popperPanelEl, setPopperPanelEl] = useState<any>();
  const { styles, attributes } = usePopper(popperButtonEl, popperPanelEl, {
    placement: "bottom-end",
    strategy: "absolute",
    modifiers: [{ name: "offset", options: { offset: [0, 8] } }],
  });

  return (
    <Popover>
      <Popover.Button
        ref={setPopperButtonEl}
        className="rounded-full bg-slate-200 p-2 text-xs text-slate-700 shadow-sm transition-all duration-150 hover:bg-teal-500"
      >
        <EyeSlashOutline className="h-5 w-5" />
      </Popover.Button>
      <Popover.Panel
        ref={setPopperPanelEl}
        onBlur={() => {
          if (!hasVisibilityChanges) return;
          setHasVisibilityChanges(false);
          if (onColumnVisibilityChange) {
            onColumnVisibilityChange?.(columnVisibility);
          }
        }}
        className="max-h-96 w-72 overflow-y-auto bg-white py-2 shadow md:max-h-80 md:w-64"
        style={styles.popper}
        {...attributes.popper}
      >
        <div className="grid">
          {table.getAllLeafColumns().map((column) => (
            <button
              key={`select-column-${column.id}`}
              disabled={lockedColumns.includes(column.id)}
              className="flex cursor-pointer items-center gap-4 px-4 py-2 hover:bg-slate-50"
            >
              <input
                type="checkbox"
                checked={column.getIsVisible()}
                onChange={(evt) => {
                  setHasVisibilityChanges(true);
                  column.getToggleVisibilityHandler()(evt);
                }}
                id={`html-for-${column.id}`}
                name={`html-for-${column.id}`}
                className="rounded-full text-teal-500 focus:ring-teal-500 disabled:text-slate-400"
                disabled={lockedColumns.includes(column.id)}
              />
              <label
                className="flex w-full grow cursor-pointer select-none justify-start text-slate-600"
                htmlFor={`html-for-${column.id}`}
              >
                {getColumnDescription(column.id)}
              </label>
            </button>
          ))}
        </div>
      </Popover.Panel>
    </Popover>
  );
};

export const DesktopPaginationBtn = (
  props: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > & { current?: boolean }
) => {
  const { children, current, onClick, disabled } = props;
  return (
    <Button
      variant={current ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className="[font-variant-numeric:tabular-nums]"
      {...(current ? { "aria-current": "page", current: `${current}` } : {})}
    >
      {children}
    </Button>
  );
};

export function ColumnWrap({ children }: { children: React.ReactNode }) {
  return <div className="flex min-w-[80px] justify-start">{children}</div>;
}
