import { createFileRoute } from "@tanstack/react-router";

import { getAuthFromRouterContext } from "@/utils/auth";
import { fetchFeaturesForClientOptions } from "@/utils/query/client";
import { fetchPermissionsByUserIdOptions } from "@/utils/query/user";

export const Route = createFileRoute("/_auth/settings")({
  beforeLoad: ({ context }) => {
    const auth = getAuthFromRouterContext(context);

    return {
      authParams: auth,
      userPermissionsOptions: fetchPermissionsByUserIdOptions({
        auth,
        userId: auth.userId,
      }),
      clientFeaturesOptions: fetchFeaturesForClientOptions({ auth }),
    };
  },
  loader: async ({ context }) => {
    const { queryClient, userPermissionsOptions, clientFeaturesOptions } =
      context;

    const promises = [];
    // ensure user permissions are being loaded in
    promises.push(queryClient.ensureQueryData(userPermissionsOptions));

    // ensure client features are being loaded in
    promises.push(queryClient.ensureQueryData(clientFeaturesOptions));

    await Promise.allSettled(promises);
    return;
  },
});
