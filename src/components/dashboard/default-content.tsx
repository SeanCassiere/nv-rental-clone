import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import DashboardDndWidgetGrid from "@/components/dashboard/dnd-widget-display-grid";
import DashboardStatsBlock from "@/components/dashboard/stats-block-display";
import WidgetPickerContent from "@/components/dashboard/widget-picker-content";
import { EmptyState } from "@/components/layouts/empty-state";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { icons } from "@/components/ui/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { usePermission } from "@/lib/hooks/usePermission";
import { useScreenSetting } from "@/lib/hooks/useScreenSetting";

import type { DashboardWidgetItemParsed } from "@/lib/schemas/dashboard";
import {
  fetchDashboardRentalStatisticsOptions,
  fetchDashboardWidgetsOptions,
  saveDashboardWidgetsMutationOptions,
} from "@/lib/query/dashboard";
import type { Auth } from "@/lib/query/helpers";

import { add } from "@/lib/config/date-fns";

import { cn } from "@/lib/utils";

interface DefaultDashboardContentProps extends Auth {
  locations: string[];
  showWidgetsPicker: boolean;
  onShowWidgetPicker: (show: boolean) => void;
}

const DefaultDashboardContent = (props: DefaultDashboardContentProps) => {
  const {
    locations,
    showWidgetsPicker,
    onShowWidgetPicker,
    auth: authParams,
  } = props;

  const queryClient = useQueryClient();

  const tomorrowTabScreenSetting = useScreenSetting(
    "Dashboard",
    "RentalManagementSummary",
    "Tomorrowtab"
  );

  const canViewTomorrowTab = tomorrowTabScreenSetting?.isVisible || false;
  const canViewRentalSummary = usePermission("VIEW_RENTAL_SUMMARY?");

  const [isWidgetsLocked, setIsWidgetsLocked] = React.useState(true);
  const [statisticsTab, setStatisticsTab] = React.useState("today");

  const currentDate = new Date();

  const clientDate =
    statisticsTab === "tomorrow" ? add(currentDate, { days: 1 }) : currentDate;

  const statistics = useQuery(
    fetchDashboardRentalStatisticsOptions({
      auth: authParams,
      filters: {
        clientDate,
        locationIds: locations,
      },
    })
  );

  const widgetList = useQuery(
    fetchDashboardWidgetsOptions({ auth: authParams })
  );
  const widgets = React.useMemo(() => {
    if (widgetList.data?.status === 200) {
      return widgetList.data?.body;
    }
    return [];
  }, [widgetList.data]);

  const saveDashboardWidgetsMutation = useMutation({
    ...saveDashboardWidgetsMutationOptions(),
    onMutate: () => {
      queryClient.cancelQueries({
        queryKey: fetchDashboardWidgetsOptions({ auth: authParams }).queryKey,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: fetchDashboardWidgetsOptions({ auth: authParams }).queryKey,
      });
    },
  });

  const handleWidgetSortingEnd = React.useCallback(
    (widgets: DashboardWidgetItemParsed[]) => {
      saveDashboardWidgetsMutation.mutate({ widgets, auth: authParams });
    },
    [saveDashboardWidgetsMutation, authParams]
  );

  const isEmpty =
    widgetList.status !== "pending" &&
    widgets.every((widget) => widget.isDeleted);

  return (
    <section
      className={cn(
        "mx-auto mb-4 mt-2.5 flex max-w-full flex-col gap-2 px-2 pt-1.5 sm:mb-2 sm:px-4 sm:pb-4"
      )}
    >
      {canViewRentalSummary && (
        <Tabs value={statisticsTab} onValueChange={setStatisticsTab}>
          {canViewTomorrowTab && (
            <div className="h-10">
              <TabsList>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
              </TabsList>
            </div>
          )}
          <TabsContent value="today">
            <DashboardStatsBlock
              statistics={
                statistics.data?.status === 200 ? statistics.data.body : null
              }
            />
          </TabsContent>
          <TabsContent value="tomorrow">
            <DashboardStatsBlock
              statistics={
                statistics.data?.status === 200 ? statistics.data.body : null
              }
            />
          </TabsContent>
        </Tabs>
      )}
      <div className="mb-2 mt-3.5 flex space-x-2">
        <Button
          size="sm"
          variant={isWidgetsLocked ? "outline" : "secondary"}
          onClick={() => setIsWidgetsLocked((prev) => !prev)}
        >
          {isWidgetsLocked ? (
            <icons.Lock className="h-5 w-5 sm:h-4 sm:w-4" />
          ) : (
            <icons.Unlock className="h-5 w-5 sm:h-4 sm:w-4" />
          )}
          <span className="sr-only">
            {isWidgetsLocked ? "Locked widgets" : "Unlocked widgets"}
          </span>
        </Button>

        <Dialog open={showWidgetsPicker} onOpenChange={onShowWidgetPicker}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant={!showWidgetsPicker ? "outline" : "secondary"}
            >
              <icons.Settings className="h-5 w-5 sm:h-4 sm:w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Customize widgets</DialogTitle>
              <DialogDescription>
                Select and order the widgets you want to see on your dashboard.
              </DialogDescription>
            </DialogHeader>
            <WidgetPickerContent
              onModalStateChange={onShowWidgetPicker}
              onWidgetSave={handleWidgetSortingEnd}
              auth={authParams}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isEmpty ? (
        <EmptyState
          title="No widgets selected"
          subtitle="You can customize your dashboard by selecting widgets from the widget picker."
          icon={icons.DashboardLayout}
          buttonOptions={{
            content: (
              <>
                <icons.Plus className="mr-2 h-4 w-4" />
                Add now
              </>
            ),
            onClick: () => {
              onShowWidgetPicker(true);
            },
          }}
        />
      ) : (
        <DashboardDndWidgetGrid
          widgets={widgets}
          selectedLocationIds={locations}
          onWidgetSortingEnd={handleWidgetSortingEnd}
          isLocked={isWidgetsLocked}
        />
      )}
    </section>
  );
};

export default DefaultDashboardContent;
