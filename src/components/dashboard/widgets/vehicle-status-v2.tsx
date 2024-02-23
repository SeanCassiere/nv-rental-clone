import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

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

import type { Auth } from "@/lib/query/helpers";
import { fetchVehiclesStatusesOptions } from "@/lib/query/vehicle";

import { STORAGE_DEFAULTS, STORAGE_KEYS } from "@/lib/utils/constants";

import { cn } from "@/lib/utils";

const data: { name: string; total: number }[] = [
  {
    total: 20,
    name: "Accident",
  },
  {
    total: 41,
    name: "Available",
  },
  // {
  //   total: 1,
  //   name: "ForSale",
  // },
  // {
  //   total: 4,
  //   name: "Grounded",
  // },
  // {
  //   total: 1,
  //   name: "InService",
  // },
  // {
  //   total: 2,
  //   name: "OnRent",
  // },
  // {
  //   total: 1,
  //   name: "Sold",
  // },
];

// const data: { name: string; total: number }[] = [];

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
    []
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

  if (totalVehicles <= 0) {
    return (
      <EmptyState
        title="No vehicles"
        subtitle="You've got no vehicles in your fleet"
        styles={{
          containerClassName: cn("h-auto pt-4 sm:h-[270px] sm:pt-0"),
        }}
      />
    );
  }

  return (
    <ScrollArea className="h-[300px] sm:h-[270px]">
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
                    {item.name}
                  </Link>
                </TooltipTrigger>
                <TooltipContent align="start">
                  <p>
                    View details of the {item.total} fleet in {item.name}{" "}
                    status.
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
                    {item.total} out of your fleet of {totalVehicles} are{" "}
                    {item.name}
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
