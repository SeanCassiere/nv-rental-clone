import { useAuth } from "react-oidc-context";

import { useGetUserPermissions } from "@/hooks/network/user/useGetUserPermissions";

export function usePermission(
  permission: string,
  defaultValue: boolean = false
) {
  const auth = useAuth();

  const permissions = useGetUserPermissions(
    auth.user?.profile.navotar_userid || ""
  );

  if (permissions.status !== "success") {
    return defaultValue;
  }

  const list = permissions.data?.status === 200 ? permissions.data?.body : [];

  const hasPermission = list.includes(permission);

  return hasPermission;
}
