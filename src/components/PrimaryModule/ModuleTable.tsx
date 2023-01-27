import { useState } from "react";
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  type Header,
  type ColumnOrderState,
} from "@tanstack/react-table";
import classNames from "classnames";
import {
  DndContext,
  useSensors,
  MouseSensor,
  TouchSensor,
  useSensor,
  closestCorners,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Menu, Transition } from "@headlessui/react";

import { EyeSlashOutline } from "../icons";
import { type TColumnListItemParsed } from "../../utils/schemas/column";
import { sortColOrderByOrderIndex } from "../../utils/ordering";

interface DraggableColumnHeaderProps {
  header: Header<any, unknown>;
  isLocked: boolean;
}
const DraggableColumnHeader = (props: DraggableColumnHeaderProps) => {
  const { header, isLocked } = props;
  const isDisabled = header.index === 0 || isLocked;
  // const isDisabled = false;

  const {
    attributes,
    listeners,
    setDraggableNodeRef,
    setDroppableNodeRef,
    transform,
    isDragging,
    transition,
    over,
  } = useSortable({
    id: header.id,
    disabled: isDisabled,
  });

  return (
    <th
      ref={isDisabled ? undefined : setDroppableNodeRef}
      colSpan={header.colSpan}
      scope="col"
      className={classNames("text-base font-medium")}
    >
      <button
        ref={setDraggableNodeRef}
        className={classNames(
          header.index === 0 ? "px-4 sm:pl-6" : "px-4",
          "h-full w-full py-3 text-left",
          (isDragging && isDisabled) || (isDragging && over?.disabled)
            ? "cursor-no-drop"
            : "",
          isDragging ? "bg-slate-200" : "bg-slate-100 text-gray-700",
          isDisabled
            ? "cursor-pointer text-gray-800 hover:cursor-not-allowed"
            : "cursor-grab"
        )}
        style={{ transform: CSS.Translate.toString(transform), transition }}
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
  columns: any[];
  rawColumnsData: TColumnListItemParsed[];
  noRows: boolean;
  onColumnOrderChange?: (accessorKeys: string[]) => void;
  lockedColumns?: (keyof T)[];
  showColumnPicker?: boolean;
  onColumnVisibilityChange?: (visibilityGraph: ColumnVisibilityGraph) => void;
}

const ModuleTable = <T extends any>(props: ModuleTableProps<T>) => {
  const lockedColumns = (props.lockedColumns || []) as string[];

  const showExtraActions = props.showColumnPicker;

  const [hasVisibilityChanges, setHasVisibilityChanges] = useState(false);

  const [columns] = useState([...props.columns]);

  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    columns.map((col) => col.accessorKey)
  );
  const [columnVisibility, setColumnVisibility] = useState(
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
    state: {
      columnOrder,
      columnVisibility,
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
  });

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {})
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

  const getColumnDescription = (headerName: string) => {
    const find = props.rawColumnsData.find(
      (col) => col.columnHeader === headerName
    );
    const description = find ? find.columnHeaderDescription : "Not found";
    return description;
  };

  return (
    <div className="overflow-hidden rounded border border-slate-200">
      {showExtraActions && (
        <div className="flex w-[100%] items-center justify-end bg-slate-100 px-4 pt-3 pb-1.5">
          {props.showColumnPicker && (
            <div className="relative">
              <Menu>
                <Menu.Button className="rounded-full bg-slate-200 p-2 text-xs text-slate-700 shadow-sm transition-all duration-150 hover:bg-teal-500">
                  <EyeSlashOutline className="h-5 w-5" />
                </Menu.Button>
                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Menu.Items
                    onBlur={() => {
                      if (!hasVisibilityChanges) return;
                      setHasVisibilityChanges(false);
                      if (props.onColumnVisibilityChange) {
                        props.onColumnVisibilityChange(columnVisibility);
                      }
                    }}
                    className="absolute top-12 right-0 max-h-96 w-72 overflow-y-auto bg-white py-2 shadow md:max-h-80 md:w-64"
                  >
                    {table.getAllLeafColumns().map((column) => (
                      <Menu.Item
                        key={`select-column-${column.id}`}
                        disabled={lockedColumns.includes(column.id)}
                      >
                        {() => (
                          <>
                            <div className="flex items-center gap-2 py-2 px-4 hover:bg-slate-50">
                              <input
                                type="checkbox"
                                checked={column.getIsVisible()}
                                onChange={(evt) => {
                                  setHasVisibilityChanges(true);
                                  column.getToggleVisibilityHandler()(evt);
                                }}
                                id={`html-for-${column.id}`}
                                name={`html-for-${column.id}`}
                                className="rounded-full text-teal-500 disabled:text-slate-400"
                                disabled={lockedColumns.includes(column.id)}
                              />
                              <label
                                className="w-full select-none text-slate-600"
                                htmlFor={`html-for-${column.id}`}
                              >
                                {getColumnDescription(column.id)}
                              </label>
                            </div>
                          </>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
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
                        className={classNames(
                          "whitespace-nowrap py-4 text-base font-normal text-slate-700",
                          cellIdx === 0 ? "px-4 sm:pl-6" : "px-4"
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
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
    </div>
  );
};

export default ModuleTable;
