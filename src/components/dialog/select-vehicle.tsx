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

import type { TVehicleListItemParsed } from "@/lib/schemas/vehicle";
import { fetchVehiclesSearchListOptions } from "@/lib/query/vehicle";

import { getAuthFromAuthHook } from "@/lib/utils/auth";

import { getXPaginationFromHeaders } from "@/lib/utils";

const columnHelper = createColumnHelper<TVehicleListItemParsed>();

interface SelectVehicleModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
  setVehicleTypeId: (vehicleTypeId: number | undefined) => void;
  onSelect?: (vehicle: TVehicleListItemParsed) => void;
  filters: {
    StartDate: Date | undefined;
    EndDate: Date | undefined;
    CurrentLocationId: string | undefined;
    VehicleTypeId: string | undefined;
  };
}

export const SelectVehicleDialog = (props: SelectVehicleModalProps) => {
  const auth = useAuth();

  const authParams = getAuthFromAuthHook(auth);

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);

  const acceptedColumns = React.useMemo(
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
  const vehicleListData = useQuery(
    fetchVehiclesSearchListOptions({
      auth: authParams,
      pagination: {
        page,
        pageSize,
      },
      filters: {
        ...(VehicleTypeId ? { VehicleTypeId } : {}),
        ...filters,
      },
    })
  );

  const headers = vehicleListData.data?.headers ?? new Headers();
  const parsedPagination = getXPaginationFromHeaders(headers);

  const vehiclesList =
    vehicleListData.data?.status === 200 ? vehicleListData.data?.body : [];

  const columnDefs = React.useMemo(() => {
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
          data={vehiclesList}
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
              ? Math.ceil(parsedPagination?.totalRecords / pageSize) ?? -1
              : 0
          }
          stickyHeader
        />
      </DialogContent>
    </Dialog>
  );
};
