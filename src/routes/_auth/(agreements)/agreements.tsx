import { createFileRoute } from "@tanstack/react-router";

import {
  fetchAgreementStatusesOptions,
  fetchAgreementTypesOptions,
} from "@/lib/query/agreement";

import { getAuthFromRouterContext } from "@/lib/utils/auth";

export const Route = createFileRoute("/_auth/(agreements)/agreements")({
  beforeLoad: ({ context }) => {
    const auth = getAuthFromRouterContext(context);
    const agreementStatusesOptions = fetchAgreementStatusesOptions({ auth });
    const agreementTypesOptions = fetchAgreementTypesOptions({ auth });
    return {
      agreementStatusesOptions,
      agreementTypesOptions,
    };
  },
  loader: async ({ context }) => {
    if (!context.auth.isAuthenticated) return;

    const promises = [
      context.queryClient.ensureQueryData(context.agreementStatusesOptions),
      context.queryClient.ensureQueryData(context.agreementTypesOptions),
    ];

    await Promise.allSettled(promises);

    return {};
  },
});
