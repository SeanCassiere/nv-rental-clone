import { useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useGetVehiclesList } from "@/hooks/network/vehicle/useGetVehiclesList";

import { type TVehicleListItemParsed } from "@/schemas/vehicle";

import { CommonTable } from "../common/common-table";

const columnHelper = createColumnHelper<TVehicleListItemParsed>();

interface SelectVehicleModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
  setVehicleTypeId: (vehicleTypeId: number | undefined) => void;
  onSelect?: (vehicle: TVehicleListItemParsed) => void;
  filters: {
    StartDate: Date | undefined;
    EndDate: Date | undefined;
    CurrentLocationId: number;
    VehicleTypeId: number | undefined;
  };
}

const SelectVehicleModal = (props: SelectVehicleModalProps) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const checkoutLocation = props.filters?.CurrentLocationId ?? 0;
  const handleClose = () => {
    props.setShow(false);
  };

  const acceptedColumns = useMemo(
    () =>
      [
        { accessor: "VehicleId", label: "#" },
        { accessor: "VehicleNo", label: "Vehicle no." },
        { accessor: "LicenseNo", label: "License no." },
        { accessor: "VehicleMakeName", label: "Make" },
        { accessor: "ModelName", label: "Model" },
        { accessor: "Year", label: "Year" },
        { accessor: "VehicleStatus", label: "Status" },
        { accessor: "VehicleType", label: "Type" },
        { accessor: "Color", label: "Color" },
      ] as const,
    []
  );

  const { VehicleTypeId, ...filters } = props.filters;
  const vehicleListData = useGetVehiclesList({
    page,
    pageSize,
    enabled: !!checkoutLocation,
    filters: {
      ...(VehicleTypeId ? { VehicleTypeId } : {}),
      ...filters,
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
            if (column.accessor === "VehicleId") {
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
          <DialogTitle>Select fleet</DialogTitle>
          <DialogDescription>
            Select a fleet from the list below
          </DialogDescription>
        </DialogHeader>
        <CommonTable
          data={vehicleListData.data?.data || []}
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
            vehicleListData.data?.totalRecords
              ? Math.ceil(vehicleListData.data?.totalRecords / pageSize) ?? -1
              : 0
          }
          stickyHeader
        />
      </DialogContent>
    </Dialog>
  );
};

export default SelectVehicleModal;
