import { lazy, Suspense, useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  createLazyFileRoute,
  getRouteApi,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";

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
import { icons } from "@/components/ui/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useFeature } from "@/hooks/useFeature";

import { getAuthFromAuthHook } from "@/utils/auth";
import { fetchLocationsListOptions } from "@/utils/query/location";
import { titleMaker } from "@/utils/title-maker";

import type { apiClient } from "@/api";
import { cn } from "@/utils";

const DefaultDashboardContent = lazy(
  () => import("@/components/dashboard/default-content")
);
const V2DashboardContent = lazy(
  () => import("@/components/dashboard/v2-content")
);

const routeApi = getRouteApi("/_auth/");

export const Route = createLazyFileRoute("/_auth/")({
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate({ from: "/" });
  const auth = useAuth();

  const authParams = getAuthFromAuthHook(auth);

  const [currentLocationIds, setCurrentLocationIds] = useState<string[]>([]);

  const setLocations = useCallback((ids: string[]) => {
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

  const [adminUrlsFeature] = useFeature("SHOW_ADMIN_URLS");
  const adminUrlsSplit = (adminUrlsFeature || "")
    .split(",")
    .map((url) => url.trim());

  const showV2Dashboard = adminUrlsSplit.includes("dashboard-v2");
  const dashboardVersion = showV2Dashboard ? "v2" : "v1";

  const handleSetShowWidgetPickerModal = useCallback(
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
      <Suspense
        fallback={
          <div className="mx-auto mb-4 mt-2.5 flex max-w-full flex-col gap-2 px-2 pt-1.5 sm:mb-2 sm:px-4 sm:pb-4">
            <Skeleton className="min-h-[400px] w-full" />
          </div>
        }
      >
        {dashboardVersion === "v1" && (
          <DefaultDashboardContent
            locations={currentLocationIds}
            showWidgetsPicker={showWidgetPickerModal}
            onShowWidgetPicker={handleSetShowWidgetPickerModal}
            auth={authParams}
          />
        )}
      </Suspense>
      <Suspense
        fallback={
          <div className="mx-auto mb-4 mt-2.5 flex max-w-full flex-col gap-2 px-2 pt-1.5 sm:mb-2 sm:px-4 sm:pb-4">
            <Skeleton className="min-h-[400px] w-full" />
          </div>
        }
      >
        {dashboardVersion === "v2" && (
          <V2DashboardContent
            locations={currentLocationIds}
            auth={authParams}
          />
        )}
      </Suspense>
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
