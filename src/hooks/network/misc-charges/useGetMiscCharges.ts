import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { fetchMiscCharges } from "../../../api/miscCharges";

export function useGetMisCharges(params: {
  enabled?: boolean;
  filters?: Omit<
    Parameters<typeof fetchMiscCharges>[0],
    "accessToken" | "userId" | "clientId"
  >;
  onSuccess?: (data: Awaited<ReturnType<typeof fetchMiscCharges>>) => void;
}) {
  const { enabled = true, filters = {}, onSuccess } = params;
  const auth = useAuth();
  const query = useQuery({
    queryKey: ["misc-charges", filters],
    queryFn: async () => {
      return await fetchMiscCharges({
        accessToken: auth.user?.access_token || "",
        userId: auth.user?.profile.navotar_userid || "",
        clientId: auth.user?.profile.navotar_clientid || "",
        ...filters,
      });
    },
    enabled: auth.isAuthenticated && enabled,
    onSuccess: (data) => {
      onSuccess?.(data);
    },
    initialData: [],
  });
  return query;
}
