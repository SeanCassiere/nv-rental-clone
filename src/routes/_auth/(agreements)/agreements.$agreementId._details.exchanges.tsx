import { createFileRoute } from "@tanstack/react-router";

import { fetchAgreementExchangesByIdOptions } from "@/lib/query/agreement";

export const Route = createFileRoute(
  "/_auth/(agreements)/agreements/$agreementId/_details/exchanges"
)({
  beforeLoad: ({ context: { authParams: auth }, params: { agreementId } }) => {
    return {
      viewAgreementExchangesOptions: fetchAgreementExchangesByIdOptions({
        auth,
        agreementId,
      }),
    };
  },
  loader: async ({ context }) => {
    if (!context.auth.isAuthenticated) return;

    await context.queryClient.ensureQueryData(
      context.viewAgreementExchangesOptions
    );

    return;
  },
});
