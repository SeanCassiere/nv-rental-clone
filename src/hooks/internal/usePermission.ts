import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { userQKeys } from "@/utils/query-key";

export function usePermission(
  permission: string,
  defaultValue: boolean = false
) {
  const auth = useAuth();

  const clientId = auth.user?.profile.navotar_clientid || "";
  const userId = auth.user?.profile.navotar_userid || "";
  const authParams = { clientId, userId };

  const permissions = useQuery(userQKeys.permissions({ auth: authParams }));

  if (permissions.status !== "success") {
    return defaultValue;
  }

  const list = permissions.data?.status === 200 ? permissions.data?.body : [];

  const hasPermission = list.includes(permission);

  return hasPermission;
}
