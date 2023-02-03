import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import classNames from "classnames";

interface TCommonTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
}

const CommonTable = <T extends unknown>(props: TCommonTableProps<T>) => {
  const table = useReactTable({
    data: props.data,
    columns: props.columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden rounded border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto divide-y divide-slate-200 bg-slate-50">
          <thead className="bg-slate-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    colSpan={header.colSpan}
                    className={classNames(
                      header.index === 0 ? "sm:pl-6" : "",
                      "px-4 py-5 text-left text-base font-medium text-gray-700"
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
          <tbody className="divide-y divide-slate-200">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell, cellIdx) => (
                    <td
                      key={cell.id}
                      className={classNames(
                        cellIdx === 0 ? "sm:pl-6" : "",
                        "whitespace-nowrap px-4 py-3 text-base font-normal text-slate-700"
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={table.getAllColumns().length}>
                  <span className="block min-h-[50px]">&nbsp;</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommonTable;
