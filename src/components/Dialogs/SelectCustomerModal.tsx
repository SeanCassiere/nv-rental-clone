import { useState, useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";

import DarkBgDialog from "../Layout/DarkBgDialog";
import { CommonTable } from "../common/common-table";

import { useGetCustomersList } from "../../hooks/network/customer/useGetCustomersList";
import { type TCustomerListItemParsed } from "../../utils/schemas/customer";

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
    <DarkBgDialog
      show={props.show}
      setShow={props.setShow}
      onClose={handleClose}
      title="Select customer"
      sizing="5xl"
      description="Select a customer from the list below"
    >
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
    </DarkBgDialog>
  );
};

export default SelectCustomerModal;
