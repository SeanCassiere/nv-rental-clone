import { useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useGetCustomersList } from "@/hooks/network/customer/useGetCustomersList";

import { type TCustomerListItemParsed } from "@/schemas/customer";

import { CommonTable } from "../common/common-table";

const columnHelper = createColumnHelper<TCustomerListItemParsed>();

interface SelectVehicleModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
  onSelect?: (customer: TCustomerListItemParsed) => void;
}

const SelectCustomerModal = (props: SelectVehicleModalProps) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const handleClose = () => {
    props.setShow(false);
  };

  const acceptedColumns = useMemo(
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

  const customerListData = useGetCustomersList({
    page,
    pageSize,
    filters: {
      Active: true,
    },
  });

  const columnDefs = useMemo(() => {
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
          data={customerListData.data?.data || []}
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
            customerListData.data?.totalRecords
              ? Math.ceil(customerListData.data?.totalRecords / pageSize) ?? -1
              : 0
          }
          stickyHeader
        />
      </DialogContent>
    </Dialog>
  );
};

export default SelectCustomerModal;
