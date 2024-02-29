import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createLazyFileRoute,
  getRouteApi,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";

import DashboardStatsBlock from "@/components/dashboard/stats-block-display";
import WidgetPickerContent from "@/components/dashboard/widget-picker-content";
import { EmptyState } from "@/components/layouts/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { icons } from "@/components/ui/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";
import { usePermission } from "@/lib/hooks/usePermission";
import { useScreenSetting } from "@/lib/hooks/useScreenSetting";

import type { DashboardWidgetItemParsed } from "@/lib/schemas/dashboard";
import {
  fetchDashboardRentalStatisticsOptions,
  fetchDashboardWidgetsOptions,
  saveDashboardWidgetsMutationOptions,
} from "@/lib/query/dashboard";
import type { Auth } from "@/lib/query/helpers";
import { fetchLocationsListOptions } from "@/lib/query/location";

import { getAuthFromAuthHook } from "@/lib/utils/auth";
import { titleMaker } from "@/lib/utils/title-maker";

import { add } from "@/lib/config/date-fns";

import type { apiClient } from "@/lib/api";
import { cn } from "@/lib/utils";

import WidgetGrid from "./-dashboard/widget-grid";

const routeApi = getRouteApi("/_auth/");

export const Route = createLazyFileRoute("/_auth/")({
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate({ from: "/" });
  const auth = useAuth();

  const authParams = getAuthFromAuthHook(auth);

  const [currentLocationIds, setCurrentLocationIds] = React.useState<string[]>(
    []
  );

  const setLocations = React.useCallback((ids: string[]) => {
    setCurrentLocationIds(ids);
  }, []);

  const { "show-widget-picker": showWidgetPickerModal = false } =
    routeApi.useSearch();

  const locationsList = useQuery(
    fetchLocationsListOptions({
      auth: authParams,
      filters: { withActive: true },
    })
  );
  const locations =
    locationsList.data?.status === 200 ? locationsList.data.body : [];

  const handleSetShowWidgetPickerModal = React.useCallback(
    (show: boolean) => {
      navigate({
        search: () => ({ ...(show ? { "show-widget-picker": show } : {}) }),
        replace: true,
      });
    },
    [navigate]
  );

  useDocumentTitle(titleMaker("Dashboard"));

  return (
    <>
      <section
        className={cn(
          "mx-auto mt-6 flex max-w-full flex-col gap-2 px-2 pt-1.5 sm:px-4 sm:pb-2"
        )}
      >
        <div
          className={cn(
            "flex min-h-[2.5rem] flex-col items-center justify-between gap-4 sm:flex-row"
          )}
        >
          <div className="flex w-full items-center justify-start gap-2">
            <h1 className="text-2xl font-semibold leading-6">Dashboard</h1>
          </div>
          <div className="flex w-full gap-2 sm:w-max">
            <LocationPicker
              locations={locations}
              selected={currentLocationIds}
              onSelect={setLocations}
            />
            <Link
              to="/agreements/new"
              search={{ stage: "rental-information" }}
              className={cn(
                buttonVariants({ size: "sm" }),
                "h-8 min-w-[120px]"
              )}
            >
              <span className="block">Start rental</span>
            </Link>
          </div>
        </div>
        <p className={cn("text-base text-foreground/80")}>
          Jump into what's going on with your fleet.
        </p>
        <Separator className="mt-3.5" />
      </section>

      <DefaultDashboardContent
        locations={currentLocationIds}
        showWidgetsPicker={showWidgetPickerModal}
        onShowWidgetPicker={handleSetShowWidgetPickerModal}
        auth={authParams}
      />
    </>
  );
}

type LocationResult = Awaited<
  ReturnType<(typeof apiClient)["location"]["getList"]>
>["body"];

function LocationPicker({
  locations,
  selected,
  onSelect,
}: {
  locations: LocationResult;
  selected: string[];
  onSelect: (items: string[]) => void;
}) {
  const isEmpty = selected.length === 0;
  const isAllSelectedEmpty = isEmpty || selected.length === locations.length;

  return (
    <div className="inline-flex items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="h-8 whitespace-nowrap border"
          >
            <icons.PlusCircle className="mr-2 h-3 w-3" />
            Locations
            <Separator orientation="vertical" className="mx-2 h-4" />
            <Badge
              variant="secondary"
              className="rounded-sm px-1 font-normal lg:hidden"
            >
              {selected.length === 0 ? "All" : selected.length}
            </Badge>
            <div className="hidden space-x-1 lg:flex">
              {selected.length > 2 ? (
                <>
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selected.length} selected
                  </Badge>
                </>
              ) : selected.length === 0 ? (
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal"
                >
                  All
                </Badge>
              ) : (
                <>
                  {selected.map((item, idx) => (
                    <Badge
                      key={`location_${item}_${idx}`}
                      variant="secondary"
                      className="rounded-sm px-1 font-normal"
                    >
                      {
                        locations.find((i) => `${i.locationId}` === item)
                          ?.locationName
                      }
                    </Badge>
                  ))}
                </>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="end">
          <Command>
            <CommandInput className="h-8" placeholder="Search locations..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    onSelect([]);
                  }}
                >
                  <div
                    className={cn(
                      "mr-2 flex h-3 w-3 items-center justify-center rounded-sm border border-primary/70",
                      isAllSelectedEmpty
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible"
                    )}
                  >
                    <icons.Check className={cn("h-4 w-4")} />
                  </div>
                  <span>All</span>
                </CommandItem>
                {locations.map((location, idx) => {
                  const isSelected = selected.includes(
                    `${location.locationId}`
                  );
                  return (
                    <CommandItem
                      key={`cmd_item_${location.locationId}_${idx}`}
                      onSelect={() => {
                        if (isSelected) {
                          onSelect(
                            selected.filter(
                              (item) => item !== `${location.locationId}`
                            )
                          );
                        } else {
                          onSelect([...selected, `${location.locationId}`]);
                        }
                      }}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-3 w-3 items-center justify-center rounded-sm border border-primary/70",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <icons.Check className={cn("h-4 w-4")} />
                      </div>
                      <span>{location.locationName}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {!isEmpty && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => {
                        onSelect([]);
                      }}
                      className="justify-center"
                    >
                      Clear
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

LocationPicker.displayName = "LocationPicker";

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
        <WidgetGrid
          widgets={widgets}
          selectedLocationIds={locations}
          onWidgetSortingEnd={handleWidgetSortingEnd}
          auth={props.auth}
        />
      )}
    </section>
  );
};
DefaultDashboardContent.displayName = "DefaultDashboardContent";
