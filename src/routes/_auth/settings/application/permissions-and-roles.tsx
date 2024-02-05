import { createFileRoute } from "@tanstack/react-router";

import { fetchRolesListOptions } from "@/lib/query/role";

export const Route = createFileRoute(
  "/_auth/settings/application/permissions-and-roles"
)({
  beforeLoad: ({ context }) => {
    const { authParams } = context;
    return {
      systemRolesListOptions: fetchRolesListOptions({
        auth: authParams,
      }),
    };
  },
  loader: async ({ context }) => {
    const { queryClient, systemRolesListOptions } = context;

    await queryClient.ensureQueryData(systemRolesListOptions);

    return;
  },
});
