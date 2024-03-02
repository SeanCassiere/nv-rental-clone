import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

import { EmptyState } from "@/components/layouts/empty-state";
import { Button, buttonVariants } from "@/components/ui/button";
import { icons } from "@/components/ui/icons";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useLocalStorage } from "@/lib/hooks/useLocalStorage";

import type { VehicleStatusCountResponse } from "@/lib/schemas/dashboard";
import { fetchDashboardVehicleStatusCountsOptions } from "@/lib/query/dashboard";
import {
  fetchVehiclesStatusesOptions,
  fetchVehiclesTypesOptions,
} from "@/lib/query/vehicle";

import { STORAGE_DEFAULTS, STORAGE_KEYS } from "@/lib/utils/constants";
import {
  calculatePercentage,
  insertSpacesBeforeCaps,
} from "@/lib/utils/random";
import { cn } from "@/lib/utils/styles";

import { WidgetSkeleton, type CommonWidgetProps } from "./_common";

export default function VehicleStatusWidget(props: CommonWidgetProps) {
  const { auth, selectedLocationIds } = props;

  const [vehicleTypeId, setVehicleTypeId] = React.useState("0");

  const statusCounts = useQuery(
    fetchDashboardVehicleStatusCountsOptions({
      auth: auth,
      filters: {
        vehicleTypeId,
        locationIds: selectedLocationIds,
        clientDate: new Date(),
      },
    })
  );

  const data = React.useMemo(
    () => (statusCounts.data?.status === 200 ? statusCounts.data?.body : []),
    [statusCounts.data?.status, statusCounts.data?.body]
  );

  const vehicleStatuses = useQuery(
    fetchVehiclesStatusesOptions({ auth: props.auth })
  );

  const getStatusIdByName = React.useCallback(
    (name: string) => {
      const status = vehicleStatuses.data?.find((s) => s.name === name);
      return status?.id || 0;
    },
    [vehicleStatuses.data]
  );

  const sortedData = React.useMemo(
    () =>
      data.sort((a, b) => {
        if (a.total < b.total) return 1;
        if (a.total > b.total) return -1;
        return 0;
      }),
    [data]
  );

  const totalVehicles = React.useMemo(
    () => sortedData.reduce((acc, item) => acc + item.total, 0),
    [sortedData]
  );

  const vehicleTypesList = useQuery(fetchVehiclesTypesOptions({ auth }));

  const vehicleTypes = React.useMemo(
    () => vehicleTypesList.data ?? [],
    [vehicleTypesList.data]
  );

  const [rowCountStr] = useLocalStorage(
    STORAGE_KEYS.tableRowCount,
    STORAGE_DEFAULTS.tableRowCount
  );
  const defaultRowCount = parseInt(rowCountStr, 10);

  return (
    <React.Fragment>
      <div className="flex max-h-8 shrink-0 items-center justify-between gap-2">
        <div className="flex grow items-center justify-between">
          <span className="font-medium">Fleet status</span>
          <Tooltip delayDuration={250}>
            <Select value={vehicleTypeId} onValueChange={setVehicleTypeId}>
              <TooltipTrigger asChild>
                <SelectTrigger className="h-8 w-auto gap-2">
                  <SelectValue placeholder="Select a vehicle type" />
                </SelectTrigger>
              </TooltipTrigger>
              <SelectContent align="end">
                <SelectGroup>
                  <SelectLabel>Vehicle types</SelectLabel>
                  <SelectItem value="0">All</SelectItem>
                  {vehicleTypes.map((type, idx) => (
                    <SelectItem
                      key={`vehicle_status_v_type_${idx}`}
                      value={String(type.id)}
                    >
                      {type.value}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <TooltipContent align="start">
              <p>Filter the fleet by vehicle type.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Button
          type="button"
          variant="ghost"
          className="h-8"
          {...props.draggableAttributes}
          {...props.draggableListeners}
        >
          <icons.GripVertical className="h-3 w-3" />
        </Button>
      </div>
      {statusCounts.status === "pending" ? (
        <WidgetSkeleton className="h-[260px]" />
      ) : totalVehicles <= 0 ? (
        <EmptyState
          title="No vehicles"
          subtitle="You've got no vehicles in your fleet"
          styles={{
            containerClassName: cn("h-auto pt-4 sm:pt-0"),
          }}
        />
      ) : (
        <ScrollArea className="h-[260px]">
          <div className="grid gap-5 pt-4 md:gap-4">
            {sortedData.map((item, idx) => (
              <VehicleStatusItem
                key={`status_widget_${item.name}_${idx}`}
                item={item}
                totalItems={totalVehicles}
                getVehicleStatusIdByName={getStatusIdByName}
                vehiclePageRowCount={defaultRowCount}
                selectedVehicleTypeId={vehicleTypeId}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </React.Fragment>
  );
}

interface VehicleStatusItemProps {
  item: VehicleStatusCountResponse;
  totalItems: number;
  getVehicleStatusIdByName: (name: string) => number;
  vehiclePageRowCount: number;
  selectedVehicleTypeId: string;
}

function VehicleStatusItem(props: VehicleStatusItemProps) {
  const {
    item,
    totalItems,
    getVehicleStatusIdByName,
    vehiclePageRowCount,
    selectedVehicleTypeId,
  } = props;

  const readableVehicleStatus = insertSpacesBeforeCaps(item.name);
  const percentage = `${calculatePercentage(item.total, totalItems).toFixed(1)}%`;

  return (
    <div className="grid gap-1.5">
      <div className="flex items-center justify-between">
        <div className="inline-flex grow gap-2">
          <Link
            to="/fleet"
            className={cn(
              buttonVariants({ variant: "link", size: "sm" }),
              "h-4 justify-start truncate p-0 underline-offset-1"
            )}
            search={() => ({
              page: 1,
              size: vehiclePageRowCount,
              filters: {
                Active: "true",
                VehicleStatus: getVehicleStatusIdByName(item.name).toString(),
                ...(selectedVehicleTypeId !== "0"
                  ? { VehicleTypeId: selectedVehicleTypeId }
                  : {}),
              },
            })}
          >
            {readableVehicleStatus || ""} - {item.total}
          </Link>
          <Tooltip delayDuration={0}>
            <TooltipTrigger>
              <span>
                <icons.Alert className="h-3.5 w-3.5" />
              </span>
            </TooltipTrigger>
            <TooltipContent align="start">
              <p>
                {percentage} of your fleet is in the status of "
                {readableVehicleStatus}"
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        <span className="inline-block truncate text-sm font-light">
          {percentage}
        </span>
      </div>
      <div>
        <Progress className="h-2.5" value={item.total} max={totalItems} />
      </div>
    </div>
  );
}
