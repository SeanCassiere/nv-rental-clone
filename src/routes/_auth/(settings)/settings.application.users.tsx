import { createFileRoute } from "@tanstack/react-router";

import { fetchUserConfigurationOptions } from "@/lib/query/user";

export const Route = createFileRoute(
  "/_auth/(settings)/settings/application/users"
)({
  beforeLoad: ({ context }) => {
    const { authParams } = context;
    return {
      systemUsersListOptions: fetchUserConfigurationOptions({
        auth: authParams,
      }),
    };
  },
  loader: async ({ context }) => {
    const { queryClient, systemUsersListOptions } = context;
    await queryClient.ensureQueryData(systemUsersListOptions);

    return;
  },
});
