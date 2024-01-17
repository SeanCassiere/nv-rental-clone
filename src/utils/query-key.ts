import { localDateToQueryYearMonthDay } from "@/utils/date";

import { sortObjectKeys } from "./sort";

type Pagination = { page: number; pageSize: number };
type Filters = Record<string, any>;
type ReferenceId = string | number;

export const agreementQKeys = {
  // search
  rootKey: "agreements",
  search: (opts: { pagination: Pagination; filters: Filters }) => [
    agreementQKeys.rootKey,
    "list",
    sortObjectKeys(opts.pagination),
    sortObjectKeys(opts.filters),
  ],
  statuses: () => [agreementQKeys.rootKey, "statuses"],
  types: () => [agreementQKeys.rootKey, "types"],
  generateNumber: (type: string) => [
    agreementQKeys.rootKey,
    "generate-number",
    type,
  ],
  // view by ID
  viewKey: "view-agreement",
  id: (id: ReferenceId) => [agreementQKeys.viewKey, id, "data"],
  summary: (id: ReferenceId) => [agreementQKeys.viewKey, id, "summary"],
};

export const reservationQKeys = {
  // search
  rootKey: "reservations",
  search: (opts: { pagination: Pagination; filters: Filters }) => [
    reservationQKeys.rootKey,
    "list",
    sortObjectKeys(opts.pagination),
    sortObjectKeys(opts.filters),
  ],
  statuses: () => [reservationQKeys.rootKey, "statuses"],
  types: () => [reservationQKeys.rootKey, "types"],
  // view by ID
  viewKey: "view-reservation",
  id: (id: ReferenceId) => [reservationQKeys.viewKey, id, "data"],
  summary: (id: ReferenceId) => [reservationQKeys.viewKey, id, "summary"],
};

export const customerQKeys = {
  // search
  rootKey: "customers",
  search: (opts: { pagination: Pagination; filters: Filters }) => [
    customerQKeys.rootKey,
    "list",
    sortObjectKeys(opts.pagination),
    sortObjectKeys(opts.filters),
  ],
  types: () => [customerQKeys.rootKey, "types"],
  // view by ID
  viewKey: "view-customer",
  id: (id: ReferenceId) => [customerQKeys.viewKey, id, "data"],
  summary: (id: ReferenceId) => [customerQKeys.viewKey, id, "summary"],
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
  // view by ID
  viewKey: "view-fleet",
  id: (id: ReferenceId) => [fleetQKeys.viewKey, id, "data"],
  summary: (id: ReferenceId) => [fleetQKeys.viewKey, id, "summary"],
};

export const userQKeys = {
  rootKey: "users",
  profile: (userId: string) => [userQKeys.rootKey, userId, "profile"],
  updatingProfile: (userId: string) => [
    userQKeys.rootKey,
    userId,
    "updating-profile",
  ],
  userConfigurations: () => [userQKeys.rootKey, "user-configurations"],
  activeUsersCount: () => [userQKeys.rootKey, "active-users-count"],
  maximumUsersCount: () => [userQKeys.rootKey, "maximum-users-count"],
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
