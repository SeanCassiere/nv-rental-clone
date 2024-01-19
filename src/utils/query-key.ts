import { localDateToQueryYearMonthDay } from "@/utils/date";

export const dashboardQKeys = {
  rootKey: "dashboard",
  widgets: () => [dashboardQKeys.rootKey, "widgets"],
  stats: (date: Date, locations: string[]) => [
    dashboardQKeys.rootKey,
    "statistics",
    `locations-[${locations.sort().join(",")}]`,
    localDateToQueryYearMonthDay(date),
  ],
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
