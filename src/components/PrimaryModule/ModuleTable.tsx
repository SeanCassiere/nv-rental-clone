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
import { Menu } from "@headlessui/react";

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
      className={classNames(
        "text-base font-medium text-teal-900",
        header.index === 0 ? "px-4 sm:pl-6" : "px-4"
      )}
    >
      <button
        ref={setDraggableNodeRef}
        className={classNames(
          "h-full w-full py-3 text-left",
          (isDragging && isDisabled) || (isDragging && over?.disabled)
            ? "cursor-no-drop"
            : "",
          isDisabled ? "cursor-pointer" : "cursor-grab",
          isDragging ? "bg-gray-300" : "bg-gray-200"
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
    <>
      {showExtraActions && (
        <div className="flex w-[100%] items-center justify-end bg-gray-200 px-4 pt-4 pb-2">
          {props.showColumnPicker && (
            <div className="relative">
              <Menu>
                <Menu.Button className="rounded-full bg-gray-300 p-2 text-xs text-teal-600">
                  <EyeSlashOutline className="h-5 w-5" />
                </Menu.Button>
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
                          <div className="flex items-center gap-2 py-2 px-4 hover:bg-gray-50">
                            <input
                              type="checkbox"
                              checked={column.getIsVisible()}
                              onChange={(evt) => {
                                setHasVisibilityChanges(true);
                                column.getToggleVisibilityHandler()(evt);
                              }}
                              id={`html-for-${column.id}`}
                              name={`html-for-${column.id}`}
                              className="rounded-full text-teal-500 disabled:text-gray-400"
                              disabled={lockedColumns.includes(column.id)}
                            />
                            <label
                              className="w-full select-none text-gray-600"
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
              </Menu>
            </div>
          )}
        </div>
      )}
      <div className="overflow-x-auto md:rounded-sm">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDndDragEnd}
          modifiers={[restrictToHorizontalAxis]}
        >
          <table className="min-w-full table-auto divide-y divide-gray-300">
            <thead className="bg-gray-200">
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
            <tbody className="divide-y divide-gray-200 bg-white">
              {props.noRows === false &&
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell, cellIdx) => (
                      <td
                        key={cell.id}
                        className={classNames(
                          "whitespace-nowrap py-4 text-base font-normal text-gray-700",
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
                    className="whitespace-nowrap px-4 py-4 text-center text-base text-gray-700"
                  >
                    No data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </DndContext>
      </div>
    </>
  );
};

export default ModuleTable;
