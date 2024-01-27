import { createFileRoute } from "@tanstack/react-router";

import { getAuthFromRouterContext } from "@/utils/auth";
import { fetchPermissionsByUserIdOptions } from "@/utils/query/user";

export const Route = createFileRoute("/_auth/settings-temp")({
  beforeLoad: ({ context }) => {
    const auth = getAuthFromRouterContext(context);

    return {
      authParams: auth,
      userPermissionsOptions: fetchPermissionsByUserIdOptions({
        auth,
        userId: auth.userId,
      }),
    };
  },
  loader: async ({ context }) => {
    const { queryClient, userPermissionsOptions } = context;

    // data fetching
    const promises = [];
    promises.push(queryClient.ensureQueryData(userPermissionsOptions));

    await Promise.allSettled(promises);

    // permissions
    const permissionsData = queryClient.getQueryData(
      userPermissionsOptions.queryKey
    );
    const permissions = permissionsData?.body ?? [];
    console.log("permissions", permissions);

    return;
  },
  component: () => <div>Hello /_auth/settings-temp!</div>,
});
