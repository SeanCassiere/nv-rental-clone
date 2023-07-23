import { useCallback, useMemo, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/router";
import {
  LockIcon,
  UnlockIcon,
  SettingsIcon,
  PlusCircle,
  CheckIcon,
} from "lucide-react";

import ProtectorShield from "@/components/protector-shield";
import DashboardStatsBlock from "@/components/dashboard/stats-block-display";
import DashboardDndWidgetGrid from "@/components/dashboard/dnd-widget-display-grid";
import WidgetPickerContent from "@/components/dashboard/widget-picker-content";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

import { indexRoute } from "@/routes";

import { useGetDashboardStats } from "@/hooks/network/dashboard/useGetDashboardStats";
import { useGetDashboardWidgetList } from "@/hooks/network/dashboard/useGetDashboardWidgetList";
import { useSaveDashboardWidgetList } from "@/hooks/network/dashboard/useSaveDashboardWidgetList";
import { useDocumentTitle } from "@/hooks/internal/useDocumentTitle";
import { useGetLocationsList } from "@/hooks/network/location/useGetLocationsList";

import type { DashboardWidgetItemParsed } from "@/schemas/dashboard";

import type { fetchLocationsList } from "@/api/locations";

import { cn } from "@/utils";
import { titleMaker } from "@/utils/title-maker";

function IndexPage() {
  const navigate = useNavigate({ from: indexRoute.id });
  const [isWidgetsLocked, setIsWidgetsLocked] = useState(true);

  const [currentLocationIds, setCurrentLocationIds] = useState<string[]>([]);

  const setLocations = useCallback((ids: string[]) => {
    setCurrentLocationIds(ids);
  }, []);

  const { "show-widget-picker": showWidgetPickerModal = false } = useSearch({
    from: indexRoute.id,
  });

  const locationsList = useGetLocationsList({ locationIsActive: true });
  const locations = locationsList.data?.data ?? [];

  const handleSetShowWidgetPickerModal = useCallback(
    (show: boolean) => {
      navigate({
        search: () => ({ ...(show ? { "show-widget-picker": show } : {}) }),
        replace: true,
      });
    },
    [navigate]
  );

  const widgetList = useGetDashboardWidgetList();

  const widgets = useMemo(() => {
    if (widgetList.data && Array.isArray(widgetList.data)) {
      return widgetList.data;
    }
    return [];
  }, [widgetList.data]);

  const statistics = useGetDashboardStats({
    locationIds: currentLocationIds,
    clientDate: new Date(),
  });

  const saveDashboardWidgetsMutation = useSaveDashboardWidgetList();

  const handleWidgetSortingEnd = useCallback(
    (widgets: DashboardWidgetItemParsed[]) => {
      saveDashboardWidgetsMutation.mutate({ widgets });
    },
    [saveDashboardWidgetsMutation]
  );

  useDocumentTitle(titleMaker("Dashboard"));

  return (
    <ProtectorShield>
      <section
        className={cn(
          "mx-auto mb-4 mt-6 flex max-w-full flex-col gap-2  px-2 pt-1.5 sm:my-6 sm:mb-2 sm:px-4 sm:pb-4"
        )}
      >
        <div className={cn("flex min-h-[2.5rem] items-center justify-between")}>
          <h1 className="text-2xl font-semibold leading-6 text-primary">
            Dashboard
          </h1>
          <LocationPicker
            locations={locations}
            selected={currentLocationIds}
            onSelect={setLocations}
          />
        </div>
        <p className={cn("text-base text-primary/80")}>
          Jump into what's going on with your fleet.
        </p>
        <Separator className="mb-4 mt-3.5" />
        <DashboardStatsBlock statistics={statistics.data} />
        <div className="mb-2 mt-3.5 flex space-x-2">
          <Button
            size="sm"
            variant={isWidgetsLocked ? "outline" : "secondary"}
            onClick={() => setIsWidgetsLocked((prev) => !prev)}
          >
            {isWidgetsLocked ? (
              <LockIcon className="h-5 w-5 sm:h-4 sm:w-4" />
            ) : (
              <UnlockIcon className="h-5 w-5 sm:h-4 sm:w-4" />
            )}
            <span className="sr-only">
              {isWidgetsLocked ? "Locked widgets" : "Unlocked widgets"}
            </span>
          </Button>

          <Dialog
            open={showWidgetPickerModal}
            onOpenChange={handleSetShowWidgetPickerModal}
          >
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant={!showWidgetPickerModal ? "outline" : "secondary"}
              >
                <SettingsIcon className="h-5 w-5 sm:h-4 sm:w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Customize widgets</DialogTitle>
                <DialogDescription>
                  Select and order the widgets you want to see on your
                  dashboard.
                </DialogDescription>
              </DialogHeader>
              <WidgetPickerContent
                onModalStateChange={handleSetShowWidgetPickerModal}
                onWidgetSave={handleWidgetSortingEnd}
              />
            </DialogContent>
          </Dialog>
        </div>
        <DashboardDndWidgetGrid
          // key={widgetIds.join(",")}
          widgets={widgets}
          selectedLocationIds={currentLocationIds}
          onWidgetSortingEnd={handleWidgetSortingEnd}
          isLocked={isWidgetsLocked}
        />
      </section>
    </ProtectorShield>
  );
}

type LocationResult = Awaited<ReturnType<typeof fetchLocationsList>>["data"];

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
            className="h-8 whitespace-nowrap border-dashed"
          >
            <PlusCircle className="mr-2 h-3 w-3" />
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
                    <CheckIcon className={cn("h-4 w-4")} />
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
                        <CheckIcon className={cn("h-4 w-4")} />
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

export default IndexPage;
