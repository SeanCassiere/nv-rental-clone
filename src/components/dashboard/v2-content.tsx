import React from "react";
import add from "date-fns/add";

import DashboardStatsBlock from "@/components/dashboard/stats-block-display";
import { QuickCheckinAgreementForm } from "@/components/dashboard/widgets/quick-checkin-agreement";
import { QuickLookupForm } from "@/components/dashboard/widgets/quick-lookup";
import { SalesAreaChart } from "@/components/dashboard/widgets/sales-status";
import { VehicleStatusPieChart } from "@/components/dashboard/widgets/vehicle-status";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { usePermission } from "@/hooks/internal/usePermission";
import { useScreenSetting } from "@/hooks/internal/useScreenSetting";
import { useGetDashboardStats } from "@/hooks/network/dashboard/useGetDashboardStats";

import { cn } from "@/utils";

interface V2DashboardContentProps {
  locations: string[];
}

export default function V2DashboardContent(props: V2DashboardContentProps) {
  const { locations } = props;

  const canViewVehicleStatus = usePermission("VIEW_VEHICLESTATUS_CHART");
  const canViewSalesStatus = usePermission("VIEW_SALES_STATUS");
  const canViewRentalSummary = usePermission("VIEW_RENTAL_SUMMARY?");
  const canViewQuickCheckin = usePermission("VIEW_QUICK_CHECKIN");
  const canViewQuickLookup = usePermission("VIEW_QUICK_LOOKUP");

  return (
    <section
      className={cn(
        "mx-auto mb-4 mt-2.5 grid max-w-full grid-cols-1 gap-3 px-2 pt-1.5 [grid-template-rows:masonry] [masonry-auto-flow:next] sm:mb-2 sm:px-4 sm:pb-4 lg:grid-cols-2 lg:gap-5"
      )}
    >
      {canViewRentalSummary || canViewVehicleStatus || canViewSalesStatus ? (
        <HeroBlock locations={locations} />
      ) : null}
      {canViewQuickCheckin && (
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">
              Quick rental checkin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <React.Suspense fallback={<Skeleton className="h-24" />}>
              <QuickCheckinAgreementForm />
            </React.Suspense>
          </CardContent>
        </Card>
      )}
      {canViewQuickLookup && (
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">
              Quick lookup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <QuickLookupForm />
          </CardContent>
        </Card>
      )}
    </section>
  );
}

function HeroBlock({ locations }: { locations: string[] }) {
  const tomorrowTabScreenSetting = useScreenSetting(
    "Dashboard",
    "RentalManagementSummary",
    "Tomorrowtab"
  );

  const canViewTomorrowTab = tomorrowTabScreenSetting?.isVisible || false;

  const canViewRentalSummary = usePermission("VIEW_RENTAL_SUMMARY?");
  const canViewVehicleStatus = usePermission("VIEW_VEHICLESTATUS_CHART");
  const canViewSalesStatus = usePermission("VIEW_SALES_STATUS");

  const [statisticsTab, setStatisticsTab] = React.useState("today");
  const [chartsTab, setChartsTab] = React.useState(
    !canViewVehicleStatus ? "sales-performance" : "fleet-status"
  );

  const canSeeCharts = canViewVehicleStatus || canViewSalesStatus;

  const bothTabs = canViewRentalSummary && canSeeCharts;

  const currentDate = new Date();

  const statistics = useGetDashboardStats({
    locationIds: locations,
    clientDate:
      statisticsTab === "tomorrow"
        ? add(currentDate, { days: 1 })
        : currentDate,
  });

  return (
    <Card
      className={cn(
        bothTabs ? "lg:col-span-2" : "col-span-1",
        "grid grid-cols-1 divide-y py-4 shadow-none lg:grid-cols-2 lg:divide-x lg:divide-y-0"
      )}
    >
      {canViewRentalSummary && (
        <CardContent
          className={cn(
            "flex flex-col p-4 pb-4 pt-0 lg:p-6 lg:pb-0 lg:pt-0",
            canSeeCharts ? "" : "lg:col-span-2"
          )}
        >
          <Tabs value={statisticsTab} onValueChange={setStatisticsTab}>
            <div className="h-10">
              <TabsList>
                <TabsTrigger value="today">Today</TabsTrigger>
                {canViewTomorrowTab && (
                  <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
                )}
              </TabsList>
            </div>
            <TabsContent value="today">
              <DashboardStatsBlock statistics={statistics.data} />
            </TabsContent>
            <TabsContent value="tomorrow">
              <DashboardStatsBlock statistics={statistics.data} />
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
      {canSeeCharts && (
        <CardContent
          className={cn(
            "flex flex-col p-4 pt-4 lg:p-6 lg:pt-0",
            canViewRentalSummary ? "" : "lg:col-span-2"
          )}
        >
          <Tabs value={chartsTab} onValueChange={setChartsTab}>
            <div className="h-10">
              <TabsList>
                {canViewVehicleStatus && (
                  <TabsTrigger value="fleet-status">Fleet status</TabsTrigger>
                )}
                {canViewSalesStatus && (
                  <TabsTrigger value="sales-performance">
                    Sales performance
                  </TabsTrigger>
                )}
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
      )}
    </Card>
  );
}
