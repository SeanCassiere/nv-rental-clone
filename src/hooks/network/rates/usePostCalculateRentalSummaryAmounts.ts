import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { postCalculateRentalSummaryAmounts } from "../../../api/summary";

export function usePostCalculateRentalSummaryAmounts(opts: {
  input: Omit<
    Parameters<typeof postCalculateRentalSummaryAmounts>[0],
    "userId" | "clientId" | "accessToken"
  >;
  enabled?: boolean;
  onSuccess?: (
    data: Awaited<ReturnType<typeof postCalculateRentalSummaryAmounts>>,
  ) => void;
}) {
  const { enabled = true } = opts;
  const auth = useAuth();
  const query = useQuery({
    queryKey: ["add-rental", "summary", JSON.stringify(opts.input)],
    enabled: auth.isAuthenticated && enabled,
    queryFn: async () => {
      return await postCalculateRentalSummaryAmounts({
        accessToken: auth.user?.access_token || "",
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        ...opts.input,
      });
    },
    onSuccess: (data) => {
      opts?.onSuccess?.(data);
    },
  });
  return query;
}
