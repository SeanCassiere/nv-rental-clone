import { localDateToQueryYearMonthDay } from "@/utils/date";

type Pagination = { page: number; pageSize: number };
type Filters = Record<string, any>;
type ReferenceId = string | number;

export const agreementQKeys = {
  // search
  rootKey: "agreements",
  columns: () => [agreementQKeys.rootKey, "columns"],
  search: ({
    filters,
    pagination,
  }: {
    pagination: Pagination;
    filters: Filters;
  }) => [agreementQKeys.rootKey, pagination, filters],
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
  notes: (id: ReferenceId) => [agreementQKeys.viewKey, id, "notes"],
  exchanges: (id: ReferenceId) => [agreementQKeys.viewKey, id, "exchanges"],
};

export const reservationQKeys = {
  // search
  rootKey: "reservations",
  columns: () => [reservationQKeys.rootKey, "columns"],
  search: ({
    filters,
    pagination,
  }: {
    pagination: Pagination;
    filters: Filters;
  }) => [reservationQKeys.rootKey, pagination, filters],
  statuses: () => [reservationQKeys.rootKey, "statuses"],
  types: () => [reservationQKeys.rootKey, "types"],
  // view by ID
  viewKey: "view-reservation",
  id: (id: ReferenceId) => [reservationQKeys.viewKey, id, "data"],
  summary: (id: ReferenceId) => [reservationQKeys.viewKey, id, "summary"],
  notes: (id: ReferenceId) => [reservationQKeys.viewKey, id, "notes"],
};

export const customerQKeys = {
  // search
  rootKey: "customers",
  columns: () => [customerQKeys.rootKey, "columns"],
  search: ({
    filters,
    pagination,
  }: {
    pagination: Pagination;
    filters: Filters;
  }) => [customerQKeys.rootKey, pagination, filters],
  types: () => [customerQKeys.rootKey, "types"],
  // view by ID
  viewKey: "view-customer",
  id: (id: ReferenceId) => [customerQKeys.viewKey, id, "data"],
  summary: (id: ReferenceId) => [customerQKeys.viewKey, id, "summary"],
  notes: (id: ReferenceId) => [customerQKeys.viewKey, id, "notes"],
};

export const fleetQKeys = {
  // search
  rootKey: "fleet",
  columns: () => [fleetQKeys.rootKey, "columns"],
  search: ({
    filters,
    pagination,
  }: {
    pagination: Pagination;
    filters: Filters;
  }) => [fleetQKeys.rootKey, pagination, filters],
  statuses: () => [fleetQKeys.rootKey, "statuses"],
  fuelLevels: () => [fleetQKeys.rootKey, "fuel-levels"],
  // view by ID
  viewKey: "view-fleet",
  id: (id: ReferenceId) => [fleetQKeys.viewKey, id, "data"],
  summary: (id: ReferenceId) => [fleetQKeys.viewKey, id, "summary"],
  notes: (id: ReferenceId) => [fleetQKeys.viewKey, id, "notes"],
};

export const clientQKeys = {
  rootKey: "client",
  profile: () => [clientQKeys.rootKey, "profile"],
  features: () => [clientQKeys.rootKey, "features"],
  screenSettings: () => [clientQKeys.rootKey, "screen-settings"],
};

export const userQKeys = {
  rootKey: "users",
  me: () => [userQKeys.rootKey, "people", "me"],
  languages: () => [userQKeys.rootKey, "languages"],
  permissions: (userId: string) => [userQKeys.rootKey, userId, "permissions"],
};

export const dashboardQKeys = {
  rootKey: "dashboard",
  widgets: () => [dashboardQKeys.rootKey, "widgets"],
  stats: (date: Date) => [
    dashboardQKeys.rootKey,
    "statistics",
    localDateToQueryYearMonthDay(date),
  ],
  messages: () => [dashboardQKeys.rootKey, "messages"],
  salesStatus: ({ locations }: { locations: string[] }) => [
    dashboardQKeys.rootKey,
    "sales-status",
    `locations-[${locations.join(",")}]`,
  ],
  vehicleStatusCounts: ({
    locationId,
    vehicleType,
  }: {
    locationId: string[];
    vehicleType: string | number;
  }) => [
    dashboardQKeys.rootKey,
    "vehicle-status-counts",
    `location-[${locationId.join(",")}]`,
    `vehicle-type-${vehicleType}`,
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
  all: () => [locationQKeys.rootKey, "all"],
};
