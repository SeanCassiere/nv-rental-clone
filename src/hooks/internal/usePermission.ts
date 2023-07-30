import { useGetUserPermissions } from "@/hooks/network/user/useGetUserPermissions";
import { useAuth } from "react-oidc-context";

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

  const hasPermission = permissions.data.includes(permission);

  return hasPermission;
}
