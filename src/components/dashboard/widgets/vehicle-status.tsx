import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

import { WidgetSkeleton } from "@/components/dashboard/dnd-widget-display-grid";
import { EmptyState } from "@/components/layouts/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useLocalStorage } from "@/lib/hooks/useLocalStorage";

import { fetchDashboardVehicleStatusCountsOptions } from "@/lib/query/dashboard";
import type { Auth } from "@/lib/query/helpers";
import { fetchVehiclesStatusesOptions } from "@/lib/query/vehicle";

import { STORAGE_DEFAULTS, STORAGE_KEYS } from "@/lib/utils/constants";

import { calculatePercentage, cn } from "@/lib/utils";

function vehicleStatusToReadable(status: string) {
  return status.replace(/([A-Z])/g, " $1").trim();
}

interface VehicleStatusWidgetProps extends Auth {
  locations: string[];
}

export default function VehicleStatusWidget(props: VehicleStatusWidgetProps) {
  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Fleet status</CardTitle>
      </CardHeader>
      <CardContent className="h-full pt-0">
        <VehicleStatusWidgetContent {...props} />
      </CardContent>
    </>
  );
}

export function VehicleStatusWidgetContent(props: VehicleStatusWidgetProps) {
  const vehicleTypeId = "0";

  const statusCounts = useQuery(
    fetchDashboardVehicleStatusCountsOptions({
      auth: props.auth,
      filters: {
        vehicleTypeId,
        locationIds: props.locations,
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

  const [rowCountStr] = useLocalStorage(
    STORAGE_KEYS.tableRowCount,
    STORAGE_DEFAULTS.tableRowCount
  );
  const defaultRowCount = parseInt(rowCountStr, 10);

  if (statusCounts.status === "pending") {
    return <WidgetSkeleton className="h-[260px]" />;
  }

  if (totalVehicles <= 0) {
    return (
      <EmptyState
        title="No vehicles"
        subtitle="You've got no vehicles in your fleet"
        styles={{
          containerClassName: cn("h-auto pt-4 sm:h-[260px] sm:pt-0"),
        }}
      />
    );
  }

  return (
    <ScrollArea className="h-[300px] sm:h-[260px]">
      <div className="grid grid-cols-3 items-center">
        {data.map((item, idx) => (
          <React.Fragment key={`status_widget_${item.name}_${idx}`}>
            <div className="truncate py-1.5">
              <Tooltip delayDuration={250}>
                <TooltipTrigger asChild>
                  <Link
                    to="/fleet"
                    className={cn(
                      buttonVariants({ variant: "link", size: "sm" }),
                      "w-full justify-start truncate p-0"
                    )}
                    search={() => ({
                      page: 1,
                      size: defaultRowCount,
                      filters: {
                        Active: "true",
                        VehicleStatus: getStatusIdByName(item.name).toString(),
                        ...(vehicleTypeId !== "0"
                          ? { VehicleTypeId: String(vehicleTypeId) }
                          : {}),
                      },
                    })}
                  >
                    {vehicleStatusToReadable(item.name || "")}
                  </Link>
                </TooltipTrigger>
                <TooltipContent align="start">
                  <p>
                    View the {item.total} fleet in status:{" "}
                    {vehicleStatusToReadable(item.name || "").toLowerCase()}
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
                    {calculatePercentage(item.total, totalVehicles).toFixed(1)}%
                    of your fleet is in the {item.name} status.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  );
}
