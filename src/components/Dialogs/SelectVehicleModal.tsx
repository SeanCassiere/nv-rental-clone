import { useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";

import { useGetVehiclesList } from "@/hooks/network/vehicle/useGetVehiclesList";

import { type TVehicleListItemParsed } from "@/schemas/vehicle";

import { CommonTable } from "../common/common-table";
import DarkBgDialog from "../Layout/DarkBgDialog";

const columnHelper = createColumnHelper<TVehicleListItemParsed>();

interface SelectVehicleModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
  onSelect?: (vehicle: TVehicleListItemParsed) => void;
  filters: {
    StartDate: Date | undefined;
    EndDate: Date | undefined;
    CurrentLocationId: number;
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

  const vehicleListData = useGetVehiclesList({
    page,
    pageSize,
    enabled: !!checkoutLocation,
    filters: {
      ...props.filters,
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
    <DarkBgDialog
      show={props.show}
      setShow={props.setShow}
      onClose={handleClose}
      title="Select fleet"
      sizing="5xl"
      description="Select a fleet from the list below"
    >
      {/* <div className="block w-full pt-3 pb-3">
      </div> */}
      {/* <div className="sticky top-0"> */}
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
      {/* </div> */}
    </DarkBgDialog>
  );
};

export default SelectVehicleModal;
