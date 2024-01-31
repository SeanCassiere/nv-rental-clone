import { createFileRoute } from "@tanstack/react-router";

import { fetchLocationsListOptions } from "@/utils/query/location";

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
  }),
  loader: async ({ context }) => {
    const { queryClient, activeLocationsListOptions } = context;

    await queryClient.ensureQueryData(activeLocationsListOptions);

    return;
  },
});
