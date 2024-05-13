import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/(settings)/settings/application")({
  loader: async ({ context }) => {
    const { queryClient, userPermissionsOptions } = context;

    // data fetching
    const promises = [];
    promises.push(queryClient.ensureQueryData(userPermissionsOptions));

    await Promise.allSettled(promises);

    return;
  },
});
