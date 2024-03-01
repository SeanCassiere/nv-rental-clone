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

  const getStatusIdByName = (name: string) => {
    const status = vehicleStatuses.data?.find((s) => s.name === name);
    return status?.id || 0;
  };

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
          <div className="grid grid-cols-3 items-center">
            {data.map((item, idx) => {
              const readableVehicleStatus = insertSpacesBeforeCaps(item.name);
              return (
                <React.Fragment key={`status_widget_${item.name}_${idx}`}>
                  <div className="truncate py-1.5">
                    <Tooltip delayDuration={250}>
                      <TooltipTrigger asChild>
                        <Link
                          to="/fleet"
                          className={cn(
                            buttonVariants({ variant: "link", size: "sm" }),
                            "h-4 w-full justify-start truncate p-0 underline-offset-1"
                          )}
                          search={() => ({
                            page: 1,
                            size: defaultRowCount,
                            filters: {
                              Active: "true",
                              VehicleStatus: getStatusIdByName(
                                item.name
                              ).toString(),
                              ...(vehicleTypeId !== "0"
                                ? { VehicleTypeId: String(vehicleTypeId) }
                                : {}),
                            },
                          })}
                        >
                          {readableVehicleStatus || ""}
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent align="start">
                        <p>
                          View the {item.total} fleet in status:{" "}
                          {(readableVehicleStatus || "").toLowerCase()}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="col-span-2 py-1.5">
                    <Tooltip delayDuration={60}>
                      <TooltipTrigger asChild>
                        <Progress value={item.total} max={totalVehicles} />
                      </TooltipTrigger>
                      <TooltipContent align="start">
                        <p>
                          {calculatePercentage(
                            item.total,
                            totalVehicles
                          ).toFixed(1)}
                          % of your fleet is in the "{readableVehicleStatus}"
                          status.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </React.Fragment>
  );
}
