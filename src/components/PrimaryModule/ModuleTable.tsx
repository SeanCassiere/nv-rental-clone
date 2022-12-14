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

interface ModuleTableProps<T> {
  data: T[];
  columns: any[];
  noRows: boolean;
  onColumnOrdering?: (accessorKeys: string[]) => void;
  lockedColumns?: (keyof T)[];
}

const ModuleTable = <T extends any>(props: ModuleTableProps<T>) => {
  const lockedColumns = (props.lockedColumns || []) as string[];

  const [columns] = useState([...props.columns]);
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    columns.map((col) => col.accessorKey)
  );

  const table = useReactTable({
    data: props.data,
    columns: props.columns,
    state: { columnOrder },
    onColumnOrderChange: (order) => {
      setColumnOrder(order);
      if (props.onColumnOrdering) {
        props.onColumnOrdering(order as any);
      }
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

  return (
    <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-sm">
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
  );
};

export default ModuleTable;
