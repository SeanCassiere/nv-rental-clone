import * as React from "react";

import { EmptyState } from "@/components/layouts/empty-state";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { Auth } from "@/lib/query/helpers";

import { cn } from "@/lib/utils";

const data: { name: string; total: number }[] = [
  {
    total: 2,
    name: "Accident",
  },
  {
    total: 41,
    name: "Available",
  },
  {
    total: 1,
    name: "ForSale",
  },
  {
    total: 4,
    name: "Grounded",
  },
  {
    total: 1,
    name: "InService",
  },
  {
    total: 2,
    name: "OnRent",
  },
  {
    total: 1,
    name: "Sold",
  },
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
      <div className="grid grid-cols-3">
        {data.map((item, idx) => (
          <React.Fragment key={`status_widget_${item.name}_${idx}`}>
            <div className="truncate py-1.5">{item.name}</div>
            <div className="col-span-2 py-1.5">
              <Tooltip delayDuration={100}>
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
