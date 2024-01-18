import { localDateToQueryYearMonthDay } from "@/utils/date";

import { sortObjectKeys } from "./sort";

type Pagination = { page: number; pageSize: number };
type Filters = Record<string, any>;
type ReferenceId = string | number;

export const agreementQKeys = {
  summary: (id: ReferenceId) => ["agreements", id, "summary"],
};

export const reservationQKeys = {
  summary: (id: ReferenceId) => ["agreements", id, "summary"],
};

export const fleetQKeys = {
  // search
  rootKey: "fleet",
  search: (opts: { pagination: Pagination; filters: Filters }) => [
    fleetQKeys.rootKey,
    "list",
    sortObjectKeys(opts.pagination),
    sortObjectKeys(opts.filters),
  ],
  statuses: () => [fleetQKeys.rootKey, "statuses"],
  fuelLevels: () => [fleetQKeys.rootKey, "fuel-levels"],
  summary: (id: ReferenceId) => ["fleet", id, "summary"],
};

export const dashboardQKeys = {
  rootKey: "dashboard",
  widgets: () => [dashboardQKeys.rootKey, "widgets"],
  stats: (date: Date, locations: string[]) => [
    dashboardQKeys.rootKey,
    "statistics",
    `locations-[${locations.sort().join(",")}]`,
    localDateToQueryYearMonthDay(date),
  ],
  messages: () => [dashboardQKeys.rootKey, "messages"],
  salesStatus: (opts: { locations: string[] }) => [
    dashboardQKeys.rootKey,
    "sales-status",
    `locations-[${opts.locations.sort().join(",")}]`,
  ],
  vehicleStatusCounts: (opts: {
    locationId: string[];
    vehicleType: string | number;
  }) => [
    dashboardQKeys.rootKey,
    "vehicle-status-counts",
    `location-[${opts.locationId.sort().join(",")}]`,
    `vehicle-type-${opts.vehicleType}`,
  ],
};

export const vehicleTypeQKeys = {
  rootKey: "vehicle-types",
  all: (options?: any) => [
    vehicleTypeQKeys.rootKey,
    "all",
    options ? options : undefined,
  ],
  lookup: () => [vehicleTypeQKeys.rootKey, "lookup"],
};

export const locationQKeys = {
  rootKey: "locations",
  all: (filters: { withActive: boolean }) => [
    locationQKeys.rootKey,
    "all",
    filters,
  ],
};
