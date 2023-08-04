import React from "react";
import type { UseQueryResult } from "@tanstack/react-query";

import DashboardStatsBlock from "@/components/dashboard/stats-block-display";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalesAreaChart } from "@/components/dashboard/widgets/sales-status";
import { VehicleStatusPieChart } from "@/components/dashboard/widgets/vehicle-status";

import type { TDashboardStats } from "@/schemas/dashboard";

import { cn } from "@/utils";

interface V2DashboardContentProps {
  locations: string[];
  statisticsQuery: UseQueryResult<TDashboardStats>;
}

export default function V2DashboardContent(props: V2DashboardContentProps) {
  const { locations, statisticsQuery: statistics } = props;
  return (
    <section
      className={cn(
        "mx-auto mb-4 mt-2.5 grid max-w-full grid-cols-1 gap-5 px-2 pt-1.5 sm:mb-2 sm:px-4 sm:pb-4 lg:grid-cols-2"
      )}
    >
      <HeroBlock locations={locations} statistics={statistics} />
      <Card className="shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Widget 1</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="">No content</p>
        </CardContent>
      </Card>
      <Card className="shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Widget 2</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="">No content</p>
        </CardContent>
      </Card>
    </section>
  );
}

function HeroBlock({
  locations,
  statistics,
}: {
  locations: string[];
  statistics: V2DashboardContentProps["statisticsQuery"];
}) {
  const [statisticsTab, setStatisticsTab] = React.useState("today");
  const [chartsTab, setChartsTab] = React.useState("fleet-status");

  return (
    <Card className="col-span-2 grid grid-cols-1 divide-y py-4 shadow-none lg:grid-cols-2 lg:divide-x lg:divide-y-0">
      <CardContent className="flex flex-col p-4 pb-4 pt-0 lg:p-6 lg:pb-0 lg:pt-0">
        <Tabs value={statisticsTab} onValueChange={setStatisticsTab}>
          <div className="h-10">
            <TabsList>
              <TabsTrigger value="today">Today</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="today">
            <DashboardStatsBlock statistics={statistics.data} />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardContent className="flex flex-col p-4 pt-4 lg:p-6 lg:pt-0">
        <Tabs value={chartsTab} onValueChange={setChartsTab}>
          <div className="h-10">
            <TabsList>
              <TabsTrigger value="fleet-status">Fleet status</TabsTrigger>
              <TabsTrigger value="sales-performance">
                Sales performance
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="fleet-status">
            <VehicleStatusPieChart locations={locations} />
          </TabsContent>
          <TabsContent value="sales-performance">
            <SalesAreaChart locations={locations} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
