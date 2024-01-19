export const dashboardQKeys = {
  rootKey: "dashboard",
  widgets: () => [dashboardQKeys.rootKey, "widgets"],
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
