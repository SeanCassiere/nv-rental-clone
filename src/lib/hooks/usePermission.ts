import { useSuspenseQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { fetchPermissionsByUserIdOptions } from "@/lib/query/user";

import { getAuthFromAuthHook } from "@/lib/utils/auth";

export function usePermission(
  permission: string,
  defaultValue: boolean = false
) {
  const auth = useAuth();
  const authParams = getAuthFromAuthHook(auth);

  const permissions = useSuspenseQuery(
    fetchPermissionsByUserIdOptions({
      auth: authParams,
      userId: authParams.userId,
    })
  );

  if (permissions.status !== "success") {
    return defaultValue;
  }

  const list = permissions.data?.status === 200 ? permissions.data?.body : [];

  const hasPermission = list.includes(permission);

  return hasPermission;
}
