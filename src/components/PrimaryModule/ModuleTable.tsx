import { useState } from "react";
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  type Header,
  type Table,
  type ColumnOrderState,
  type Column,
} from "@tanstack/react-table";
import classNames from "classnames";
import { useDrag, useDrop } from "react-dnd";

const reorderColumn = (
  draggedColumnId: string,
  targetColumnId: string,
  columnOrder: string[]
): ColumnOrderState => {
  columnOrder.splice(
    columnOrder.indexOf(targetColumnId),
    0,
    columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0] as string
  );
  return [...columnOrder];
};

const DraggableColumnHeader = ({
  header,
  table,
  headerIdx,
  isLocked,
}: {
  header: Header<any, unknown>;
  headerIdx: number;
  table: Table<any>;
  isLocked: boolean;
}) => {
  const { getState, setColumnOrder } = table;
  const { columnOrder } = getState();
  const { column } = header;

  const [, dropRef] = useDrop({
    accept: "column",
    drop: (draggedColumn: Column<any>) => {
      const newColumnOrder = reorderColumn(
        draggedColumn.id,
        column.id,
        columnOrder
      );
      setColumnOrder(newColumnOrder);
    },
    canDrop() {
      return !isLocked;
    },
  });

  const [{ isDragging }, dragRef, previewRef] = useDrag({
    canDrag: !isLocked,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => column,
    type: "column",
  });

  return (
    <th
      ref={dropRef}
      colSpan={header.colSpan}
      scope="col"
      className={classNames(
        "text-base font-medium text-teal-900",
        headerIdx === 0 ? "px-4 sm:pl-6" : "px-4"
      )}
      style={{ opacity: isDragging ? 0.85 : 1 }}
    >
      <div ref={previewRef} className={classNames("h-full w-full text-left")}>
        <button
          ref={dragRef}
          className={classNames(
            "py-3 text-left",
            isLocked ? "cursor-no-drop" : ""
          )}
        >
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}
        </button>
      </div>
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

  return (
    <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-sm">
      <table className="min-w-full table-auto divide-y divide-gray-300">
        <thead className="bg-gray-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header, headerIdx) => (
                <DraggableColumnHeader
                  key={header.id}
                  header={header}
                  headerIdx={headerIdx}
                  table={table}
                  isLocked={lockedColumns.includes(header.id)}
                />
              ))}
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
    </div>
  );
};

export default ModuleTable;
