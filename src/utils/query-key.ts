export const dashboardQKeys = {
  rootKey: "dashboard",
  widgets: () => [dashboardQKeys.rootKey, "widgets"],
  salesStatus: (opts: { locations: string[] }) => [
    dashboardQKeys.rootKey,
    "sales-status",
    `locations-[${opts.locations.sort().join(",")}]`,
  ],
};
