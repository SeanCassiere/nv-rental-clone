import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { useAuth } from "react-oidc-context";

import { CommonTable } from "@/components/common-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { TCustomerListItemParsed } from "@/lib/schemas/customer";
import { fetchCustomersSearchListOptions } from "@/lib/query/customer";

import { getAuthFromAuthHook } from "@/lib/utils/auth";

import { getXPaginationFromHeaders } from "@/lib/utils";

const columnHelper = createColumnHelper<TCustomerListItemParsed>();

interface SelectVehicleModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
  onSelect?: (customer: TCustomerListItemParsed) => void;
}

export const SelectCustomerDialog = (props: SelectVehicleModalProps) => {
  const auth = useAuth();

  const authParams = getAuthFromAuthHook(auth);

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);

  const acceptedColumns = React.useMemo(
    () =>
      [
        { accessor: "CustomerId", label: "#" },
        { accessor: "FirstName", label: "First name" },
        { accessor: "LastName", label: "Last name" },
        { accessor: "hPhone", label: "Phone" },
        { accessor: "Address1", label: "Address" },
        { accessor: "City", label: "City" },
        { accessor: "ZipCode", label: "Zip" },
      ] as const,
    []
  );

  const customerListData = useQuery(
    fetchCustomersSearchListOptions({
      auth: authParams,
      pagination: {
        page,
        pageSize,
      },
      filters: {
        Active: "true",
      },
    })
  );

  const columnDefs = React.useMemo(() => {
    const columns: any[] = [];

    acceptedColumns.forEach((column) => {
      columns.push(
        columnHelper.accessor(column.accessor, {
          id: column.label,
          header: () => column.label,
          cell: (item) => {
            if (column.accessor === "CustomerId") {
              const row = item.table.getRow(item.row.id).original;
              return (
                <button
                  onClick={() => {
                    props.onSelect?.(row);
                    props.setShow(false);
                  }}
                >
                  Select
                </button>
              );
            }
            return item.getValue();
          },
        })
      );
    });
    return columns;
  }, [acceptedColumns, props]);

  const headers = customerListData.data?.headers ?? new Headers();
  const parsedPagination = getXPaginationFromHeaders(headers);

  const customersList =
    customerListData.data?.status === 200 ? customerListData.data?.body : [];

  return (
    <Dialog open={props.show} onOpenChange={props.setShow}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Select customer</DialogTitle>
          <DialogDescription>
            Select a customer from the list below
          </DialogDescription>
        </DialogHeader>
        <CommonTable
          data={customersList}
          columns={columnDefs}
          hasPagination
          paginationMode="server"
          paginationState={{
            pageIndex: page - 1,
            pageSize,
          }}
          onPaginationChange={(newState) => {
            setPage(newState.pageIndex + 1);
            setPageSize(newState.pageSize);
          }}
          totalPages={
            parsedPagination?.totalRecords
              ? (Math.ceil(parsedPagination?.totalRecords / pageSize) ?? -1)
              : 0
          }
          stickyHeader
        />
      </DialogContent>
    </Dialog>
  );
};
