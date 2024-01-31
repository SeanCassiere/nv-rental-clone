import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute, getRouteApi } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { EmptyState } from "@/components/layouts/empty-state";
import { badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { icons } from "@/components/ui/icons";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import { TLocationParsed } from "@/schemas/location";

import { cn } from "@/utils";

export const Route = createLazyFileRoute(
  "/_auth/settings/application/locations"
)({
  component: LocationsPage,
});

const routeApi = getRouteApi("/_auth/settings/application/locations");

function LocationsPage() {
  const { t } = useTranslation();

  const [filterMode, onChangeFilterMode] = React.useState("active");

  return (
    <>
      <Card className="shadow-none">
        <CardHeader className="p-4 lg:p-6">
          <CardTitle className="text-lg">
            {t("titles.locations", { ns: "settings" })}
          </CardTitle>
          <CardDescription className="text-base">
            {t("descriptions.locations", { ns: "settings" })}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0 lg:px-6 lg:pb-5">
          <div className="flex flex-col justify-start gap-2 pb-4 md:flex-row md:items-center">
            <Button
              size="sm"
              className="w-max"
              // onClick={() => setShowNew(true)}
            >
              <icons.Plus className="h-4 w-4 sm:mr-2" />
              <span>{t("labels.addLocation", { ns: "settings" })}</span>
            </Button>
            <Select
              defaultValue="active"
              value={filterMode}
              onValueChange={onChangeFilterMode}
            >
              <SelectTrigger className="h-9 w-full md:w-[180px]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="active">
                    {t("display.active", { ns: "labels" })}
                  </SelectItem>
                  <SelectItem value="inactive">
                    {t("display.inactive", { ns: "labels" })}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <React.Suspense fallback={<Skeleton className="h-72" />}>
            <ListLocations
              filterMode={filterMode === "inactive" ? "inactive" : "active"}
            />
          </React.Suspense>
        </CardContent>
      </Card>
    </>
  );
}

function ListLocations(props: { filterMode: "active" | "inactive" }) {
  return props.filterMode === "active" ? (
    <ListActiveLocations />
  ) : (
    <ListInactiveLocations />
  );
}

function ListActiveLocations() {
  const { activeLocationsListOptions } = routeApi.useRouteContext();

  const query = useSuspenseQuery(activeLocationsListOptions);

  const locations = query.data.status === 200 ? query.data.body : [];
  const locationsSorted = locations.sort((a, b) =>
    (a.locationName || "").localeCompare(b.locationName || "")
  );

  return (
    <ul role="list" className="divide-y divide-muted">
      {locationsSorted.length === 0 ? (
        <EmptyState title="No results" subtitle="No inactive locations found" />
      ) : (
        locationsSorted.map((location, idx) => (
          <LocationItem
            key={`location_${location.locationId}_${idx}`}
            location={location}
          />
        ))
      )}
    </ul>
  );
}

function ListInactiveLocations() {
  const { inactiveLocationsListOptions } = routeApi.useRouteContext();

  const query = useSuspenseQuery(inactiveLocationsListOptions);

  const locations = query.data.status === 200 ? query.data.body : [];
  const locationsSorted = locations.sort((a, b) =>
    (a.locationName || "").localeCompare(b.locationName || "")
  );

  return (
    <ul role="list" className="divide-y divide-muted">
      {locationsSorted.length === 0 ? (
        <EmptyState title="No results" subtitle="No inactive locations found" />
      ) : (
        locationsSorted.map((location, idx) => (
          <LocationItem
            key={`location_${location.locationId}_${idx}`}
            location={location}
          />
        ))
      )}
    </ul>
  );
}

function makeLocationAddress(location: TLocationParsed) {
  const { address1, address2, city, stateName, countryName } = location;
  let formattedAddress = "";

  if (address1) {
    formattedAddress += address1 + ", ";
  }
  if (address2) {
    formattedAddress += address2 + ", ";
  }
  if (city) {
    formattedAddress += city + ", ";
  }
  if (stateName) {
    formattedAddress += stateName + ", ";
  }
  if (countryName) {
    formattedAddress += countryName;
  }

  return formattedAddress;
}

function LocationItem(props: { location: TLocationParsed }) {
  const { location } = props;
  const { t } = useTranslation();

  return (
    <li className="flex justify-between gap-x-6 py-5">
      <div className="flex min-w-0 gap-x-4">
        <div className="min-w-0 max-w-xl flex-auto text-sm">
          <p className="flex items-baseline truncate font-semibold leading-6">
            {location.locationName}
          </p>
          <p className="mt-1 truncate leading-5 text-muted-foreground">
            {makeLocationAddress(location) || "No address"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-x-4 text-sm">
        <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
          <p className={cn(badgeVariants({ variant: "outline" }))}>
            {location.active ? "Active" : "Inactive"}
          </p>
          <div className="mt-1 flex items-center gap-x-1.5">
            <div className="flex-none rounded-full bg-background/20 p-1">
              <div
                className={cn(
                  "h-2 w-2 rounded-full",
                  location.isReservation ? "bg-emerald-500" : "bg-destructive"
                )}
              />
            </div>
            <p className="select-none leading-5 text-muted-foreground">
              {location.isReservation
                ? t("labels.availableOnline", { ns: "settings" })
                : t("labels.notAvailableOnline", { ns: "settings" })}
            </p>
          </div>
        </div>
        <div className="flex grow-0 items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger
              // onMouseOver={handlePrefetch}
              // onTouchStart={handlePrefetch}
              asChild
            >
              <Button
                variant="ghost"
                size="icon"
                // disabled={isSystemRole}
                className="h-8 w-8"
              >
                <icons.More className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="sr-only">
                  {t("buttons.moreActions", { ns: "labels" })}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem
                //  onClick={() => setShowEdit(true)}
                >
                  <icons.Edit className="mr-2 h-3 w-3" />
                  <span>{t("buttons.edit", { ns: "labels" })}</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </li>
  );
}
