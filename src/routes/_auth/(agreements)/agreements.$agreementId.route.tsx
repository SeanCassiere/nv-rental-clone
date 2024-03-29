import { createFileRoute } from "@tanstack/react-router";

import {
  fetchAgreementByIdOptions,
  fetchAgreementSummaryByIdOptions,
} from "@/lib/query/agreement";

import { getAuthFromRouterContext } from "@/lib/utils/auth";

export const Route = createFileRoute(
  "/_auth/(agreements)/agreements/$agreementId"
)({
  beforeLoad: ({ context, params: { agreementId } }) => {
    const auth = getAuthFromRouterContext(context);

    return {
      authParams: auth,
      viewAgreementOptions: fetchAgreementByIdOptions({
        auth,
        agreementId,
      }),
      viewAgreementSummaryOptions: fetchAgreementSummaryByIdOptions({
        auth,
        agreementId,
      }),
    };
  },
  loader: async ({ context }) => {
    if (!context.auth.isAuthenticated) return;

    const promises = [
      context.queryClient.ensureQueryData(context.viewAgreementOptions),
      context.queryClient.ensureQueryData(context.viewAgreementSummaryOptions),
    ];

    await Promise.all(promises);
  },
});
