import { type PropsWithChildren } from "react";
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import classNames from "classnames";

interface ModuleTableProps<T> {
  data: T[];
  columns: any[];
  onRowReorderEnd?: () => void;
  noRows: boolean;
}

const ModuleTable = <T extends any>(
  props: PropsWithChildren<ModuleTableProps<T>>
) => {
  const table = useReactTable({
    data: props.data,
    columns: props.columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-sm">
      <table className="min-w-full table-auto divide-y divide-gray-300">
        <thead className="bg-teal-500">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header, headerIdx) => (
                <th
                  key={header.id}
                  scope="col"
                  className={classNames(
                    "select-none py-3.5 text-left text-base font-medium text-white",
                    headerIdx === 0 ? "px-4 sm:pl-6" : "px-4"
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
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
