import { useCallback, useMemo, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/router";
import {
  LockIcon,
  UnlockIcon,
  SettingsIcon,
  PlusCircle,
  CheckIcon,
  XIcon,
} from "lucide-react";

import Protector from "@/components/Protector";
import DashboardStatsBlock from "@/components/Dashboard/DashboardStatsBlock";
import DashboardDndWidgetGrid from "@/components/Dashboard/DashboardDndWidgetGrid";
import DashboardWidgetPickerModal from "@/components/Dialogs/DashboardWidgetPickerModal";
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

import { indexRoute } from "@/routes";

import { useGetDashboardStats } from "@/hooks/network/dashboard/useGetDashboardStats";
import { useGetDashboardWidgetList } from "@/hooks/network/dashboard/useGetDashboardWidgetList";
import { useSaveDashboardWidgetList } from "@/hooks/network/dashboard/useSaveDashboardWidgetList";
import { useDocumentTitle } from "@/hooks/internal/useDocumentTitle";

import type { DashboardWidgetItemParsed } from "@/schemas/dashboard";

import { cn } from "@/utils";
import { titleMaker } from "@/utils/title-maker";
import { useGetLocationsList } from "@/hooks/network/location/useGetLocationsList";
import { fetchLocationsList } from "@/api/locations";
import { Badge } from "@/components/ui/badge";

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

  const locations = useGetLocationsList({ locationIsActive: true });

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
  const widgetIds = useMemo(() => {
    if (widgetList.data && Array.isArray(widgetList.data)) {
      return widgetList.data

        .filter((widget) => widget.isDeleted === false)
        .map((widget) => widget.widgetID);
    }
    return [];
  }, [widgetList.data]);
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
    <Protector>
      <DashboardWidgetPickerModal
        show={showWidgetPickerModal}
        onModalStateChange={handleSetShowWidgetPickerModal}
        onWidgetSave={handleWidgetSortingEnd}
      />
      <section
        className={cn(
          "mx-auto my-6 flex max-w-full flex-col gap-2 px-2 pt-1.5 sm:mx-4 sm:px-1"
        )}
      >
        <div className={cn("flex min-h-[2.5rem] items-center justify-between")}>
          <h1 className="text-2xl font-semibold leading-6 text-primary">
            Dashboard
          </h1>
          <LocationPicker
            locations={locations.data.data ?? []}
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

          <Button
            size="sm"
            variant={!showWidgetPickerModal ? "outline" : "secondary"}
            onClick={() => {
              handleSetShowWidgetPickerModal(true);
            }}
          >
            <SettingsIcon className="h-5 w-5 sm:h-4 sm:w-4" />
          </Button>
        </div>
        <DashboardDndWidgetGrid
          // key={widgetIds.join(",")}
          widgets={widgets}
          selectedLocationIds={currentLocationIds}
          onWidgetSortingEnd={handleWidgetSortingEnd}
          isLocked={isWidgetsLocked}
        />
      </section>
    </Protector>
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
