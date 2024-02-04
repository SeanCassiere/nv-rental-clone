import { createFileRoute } from "@tanstack/react-router";

import {
  fetchLocationCountriesListOptions,
  fetchLocationsListOptions,
} from "@/utils/query/location";

export const Route = createFileRoute("/_auth/settings/application/locations")({
  beforeLoad: ({ context }) => ({
    activeLocationsListOptions: fetchLocationsListOptions({
      auth: context.authParams,
      filters: { withActive: true },
    }),
    inactiveLocationsListOptions: fetchLocationsListOptions({
      auth: context.authParams,
      filters: { withActive: false },
    }),
    countriesListOptions: fetchLocationCountriesListOptions({
      auth: context.authParams,
    }),
  }),
  loader: async ({ context }) => {
    const { queryClient, activeLocationsListOptions, countriesListOptions } =
      context;

    const promises = [
      queryClient.ensureQueryData(activeLocationsListOptions),
      queryClient.ensureQueryData(countriesListOptions),
    ];

    await Promise.all(promises);

    return;
  },
});
