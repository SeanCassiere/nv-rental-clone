import { localDateToQueryYearMonthDay } from "@/utils/date";

type ReferenceId = string | number;

export const agreementQKeys = {
  summary: (id: ReferenceId) => ["agreements", id, "summary"],
};

export const reservationQKeys = {
  summary: (id: ReferenceId) => ["reservations", id, "summary"],
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

export const locationQKeys = {
  rootKey: "locations",
  all: (filters: { withActive: boolean }) => [
    locationQKeys.rootKey,
    "all",
    filters,
  ],
};
