import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { fetchModuleColumns } from "../../api/columns";
import type { ColumnListItemType } from "../../types/Column";

export function useGetModuleColumns({
  module,
}: {
  module: "reservations" | "agreements" | "customers" | "vehicles";
}) {
  const auth = useAuth();
  const query = useQuery<ColumnListItemType[]>({
    queryKey: [module, "columns"],
    queryFn: () =>
      fetchModuleColumns({
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
        module,
      }),
    enabled: auth.isAuthenticated,
    initialData: [],
  });
  return query;
}
