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
  type Table,
  type Header,
  type ColumnOrderState,
  type ColumnDef,
  type PaginationState,
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
  ChevronLeftOutline,
  ChevronRightOutline,
  EyeSlashOutline,
} from "../icons";

import { type TColumnListItemParsed } from "../../utils/schemas/column";
import { sortColOrderByOrderIndex } from "../../utils/ordering";
import { getPaginationWithDoubleEllipsis } from "../../utils/pagination";
import { cn } from "@/utils";

interface DraggableColumnHeaderProps {
  header: Header<any, unknown>;
  isLocked: boolean;
}
const DraggableColumnHeader = (props: DraggableColumnHeaderProps) => {
  const { header, isLocked } = props;
  const isDisabled = header.index === 0 || isLocked;

  const {
    attributes,
    listeners,
    transform,
    isDragging,
    transition,
    over,
    setNodeRef,
    setActivatorNodeRef,
  } = useSortable({
    id: header.id,
    disabled: isDisabled,
  });

  return (
    <th
      ref={isDisabled ? undefined : setNodeRef}
      colSpan={header.colSpan}
      scope="col"
      className={cn("text-base font-semibold")}
      style={{ transform: CSS.Translate.toString(transform), transition }}
    >
      <button
        ref={setActivatorNodeRef}
        className={cn(
          header.index === 0 ? "px-4 sm:pl-6" : "px-4",
          "h-full w-full py-3 text-left",
          (isDragging && isDisabled) || (isDragging && over?.disabled)
            ? "cursor-no-drop"
            : "",
          isDragging ? "bg-slate-200" : "bg-slate-100 text-gray-700",
          isDisabled
            ? "cursor-pointer text-gray-800 hover:cursor-not-allowed"
            : "cursor-grab",
        )}
        {...listeners}
        {...attributes}
      >
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
      </button>
    </th>
  );
};

export type ColumnVisibilityGraph = { [columnHeader: string]: boolean };

interface ModuleTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  rawColumnsData: TColumnListItemParsed[];
  noRows: boolean;
  onColumnOrderChange?: (accessorKeys: string[]) => void;
  lockedColumns?: (keyof T)[];
  showColumnPicker?: boolean;
  onColumnVisibilityChange?: (visibilityGraph: ColumnVisibilityGraph) => void;
  pagination: PaginationState;
  totalPages: number;
  onPaginationChange: (pagination: PaginationState) => void;
}

const ModuleTable = <T extends any>(props: ModuleTableProps<T>) => {
  const lockedColumns = (props.lockedColumns || []) as string[];

  const showExtraActions = props.showColumnPicker;

  const [columns] = useState([...props.columns]);

  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    columns.map((col) => col.id!),
  );
  const [columnVisibility, setColumnVisibility] = useState(
    props.rawColumnsData
      .sort(sortColOrderByOrderIndex)
      .reduce(
        (acc, col) => ({ ...acc, [col.columnHeader]: col.isSelected }),
        {},
      ),
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
    onColumnOrderChange: (order) => {
      setColumnOrder(order);
      if (props.onColumnOrderChange) {
        props.onColumnOrderChange(order as any);
      }
    },
    onColumnVisibilityChange: (changesFunc) => {
      setColumnVisibility(changesFunc);
    },
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: (paginationUpdaterFunction) => {
      // @ts-expect-error
      const newPagination = paginationUpdaterFunction(props.pagination!);
      props.onPaginationChange(newPagination);
    },
  });

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDndDragEnd = (evt: DragEndEvent) => {
    if (!evt.over || evt.over.disabled || evt.active.id === evt.over.id) return;

    const draggingId = evt.active.id;
    const overId = evt.over.id;
    const newOrder = arrayMove(
      columnOrder,
      columnOrder.indexOf(draggingId as string),
      columnOrder.indexOf(overId as string),
    );
    table.setColumnOrder(newOrder);
  };

  const getColumnDescription = (headerName: string) => {
    const find = props.rawColumnsData.find(
      (col) => col.columnHeader === headerName,
    );
    const description = find ? find.columnHeaderDescription : "Not found";
    return description;
  };

  const pageNumbers = useMemo(
    () =>
      getPaginationWithDoubleEllipsis(
        props.pagination.pageIndex + 1,
        props.totalPages,
        7,
      ),
    [props.pagination.pageIndex, props.totalPages],
  );

  return (
    <div className="overflow-hidden rounded border border-slate-200">
      {showExtraActions && (
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
      )}
      <div className="overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDndDragEnd}
          modifiers={[restrictToHorizontalAxis]}
        >
          <table className="min-w-full table-auto divide-y divide-slate-200 bg-slate-50">
            <thead className="bg-slate-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
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
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-200 bg-slate-50">
              {props.noRows === false &&
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell, cellIdx) => (
                      <td
                        key={cell.id}
                        className={cn(
                          "whitespace-nowrap py-4 text-base font-normal text-slate-700",
                          cellIdx === 0 ? "px-4 sm:pl-6" : "px-4",
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              {props.noRows && (
                <tr>
                  <td
                    colSpan={table.getAllColumns().length}
                    className="whitespace-nowrap px-4 py-4 text-center text-base text-slate-700"
                  >
                    No data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </DndContext>
      </div>
      {/* pagination */}
      <div className="flex flex-1 justify-between bg-slate-50 px-2 py-2.5 sm:hidden">
        <button
          className="relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-50 disabled:text-slate-300"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
        >
          Previous
        </button>
        <button
          className="relative ml-3 inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-50 disabled:text-slate-300"
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
        >
          Next
        </button>
      </div>
      <div className="hidden border-t border-slate-200 bg-slate-50 sm:flex sm:flex-1 sm:items-center sm:justify-between sm:px-4 sm:py-3.5">
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <DesktopPaginationBtn
              className="rounded-l px-2"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftOutline className="h-5 w-5" aria-hidden="true" />
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
              <ChevronRightOutline className="h-5 w-5" aria-hidden="true" />
            </DesktopPaginationBtn>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default ModuleTable;

const ColumnPickerPopover = <T extends any>({
  table,
  getColumnDescriptionFn: getColumnDescription,
  onColumnVisibilityChange,
  columnVisibility,
  lockedColumns = [],
}: {
  table: Table<T>;
  getColumnDescriptionFn: (headerName: string) => string | null;
  onColumnVisibilityChange?: ModuleTableProps<T>["onColumnVisibilityChange"];
  columnVisibility: ColumnVisibilityGraph;
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
              className="flex cursor-pointer items-center gap-4 py-2 px-4 hover:bg-slate-50"
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

const DesktopPaginationBtn = (
  props: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > & { current?: boolean },
) => {
  const { children, current, className, ...otherProps } = props;
  return (
    <button
      {...otherProps}
      className={cn(
        "relative inline-flex items-center border px-4 py-2 text-sm font-medium hover:bg-slate-50 focus:z-20",
        current
          ? "z-10 border-teal-500 bg-teal-50 text-teal-600"
          : "border-slate-300 bg-white text-slate-500",
        "disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-50 disabled:text-slate-300",
        className,
      )}
      {...(current ? { "aria-current": "page", current: `${current}` } : {})}
    >
      {children}
    </button>
  );
};
