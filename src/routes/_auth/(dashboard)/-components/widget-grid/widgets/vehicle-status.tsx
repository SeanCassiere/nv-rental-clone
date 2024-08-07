import * as React from "react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

import { EmptyState } from "@/components/empty-state";
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

import { useWidgetName } from "@/routes/_auth/(dashboard)/-components/useWidgetName";

import { STORAGE_DEFAULTS, STORAGE_KEYS } from "@/lib/utils/constants";
import {
  calculatePercentage,
  insertSpacesBeforeCaps,
} from "@/lib/utils/random";
import { cn } from "@/lib/utils/styles";

import { WidgetSkeleton, type CommonWidgetProps } from "./_common";

export default function VehicleStatusWidget(props: CommonWidgetProps) {
  const widgetName = useWidgetName(props.widgetId);

  const [vehicleTypeId, setVehicleTypeId] = React.useState("0");

  const vehicleTypesList = useQuery(
    fetchVehiclesTypesOptions({ auth: props.auth })
  );
  const vehicleTypes = React.useMemo(
    () => vehicleTypesList.data ?? [],
    [vehicleTypesList.data]
  );

  return (
    <React.Fragment>
      <div className="flex max-h-8 shrink-0 items-center justify-between gap-2">
        <div className="flex grow items-center justify-between">
          <span className="font-medium">{widgetName}</span>
          <Select value={vehicleTypeId} onValueChange={setVehicleTypeId}>
            <SelectTrigger className="h-8 w-auto gap-2">
              <SelectValue placeholder="Select a vehicle type" />
            </SelectTrigger>
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
      <React.Suspense fallback={<WidgetSkeleton className="mt-1 h-[250px]" />}>
        <VehicleStatusChart {...props} vehicleTypeId={vehicleTypeId} />
      </React.Suspense>
    </React.Fragment>
  );
}

function VehicleStatusChart(
  props: CommonWidgetProps & { vehicleTypeId: string }
) {
  const statusCountQuery = useSuspenseQuery(
    fetchDashboardVehicleStatusCountsOptions({
      auth: props.auth,
      filters: {
        vehicleTypeId: props.vehicleTypeId,
        locationIds: props.selectedLocationIds,
        clientDate: new Date(),
      },
    })
  );

  const data = React.useMemo(
    () =>
      statusCountQuery.data.status === 200 ? statusCountQuery.data.body : [],
    [statusCountQuery.data.body, statusCountQuery.data.status]
  );

  const vehicleStatusesQuery = useSuspenseQuery(
    fetchVehiclesStatusesOptions({ auth: props.auth })
  );

  const vehicleStatuses = React.useMemo(
    () => vehicleStatusesQuery.data ?? [],
    [vehicleStatusesQuery.data]
  );

  const getStatusIdByName = React.useCallback(
    (name: string) => {
      const status = vehicleStatuses.find((s) => s.name === name);
      return status?.id || 0;
    },
    [vehicleStatuses]
  );

  const sortedData = data.sort((a, b) => {
    if (a.total < b.total) return 1;
    if (a.total > b.total) return -1;
    return 0;
  });

  const totalVehicles = sortedData.reduce((acc, item) => acc + item.total, 0);

  const [rowCountStr] = useLocalStorage(
    STORAGE_KEYS.tableRowCount,
    STORAGE_DEFAULTS.tableRowCount
  );
  const defaultRowCount = parseInt(rowCountStr, 10);

  return totalVehicles <= 0 ? (
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
            selectedVehicleTypeId={props.vehicleTypeId}
          />
        ))}
      </div>
    </ScrollArea>
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
                {percentage} of your fleet is in the status of &quot;
                {readableVehicleStatus}&quot;
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
