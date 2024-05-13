import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_auth/(settings)/settings/rates-and-charges"
)({
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
    const permissions = (permissionsData?.body ?? []).map((v) =>
      v.toUpperCase()
    );
    const canViewAdminTab = permissions.includes("VIEW_ADMIN_TAB");

    if (!canViewAdminTab)
      throw redirect({
        to: "/settings/profile",
        replace: true,
      });

    return;
  },
  component: () => <div>Hello /_auth/settings/rates-and-charges!</div>,
});
