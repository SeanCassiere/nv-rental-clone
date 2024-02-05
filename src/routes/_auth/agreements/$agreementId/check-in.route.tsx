import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import {
  fetchAgreementByIdOptions,
  fetchAgreementSummaryByIdOptions,
} from "@/lib/query/agreement";

import { getAuthFromRouterContext } from "@/lib/utils/auth";

export const Route = createFileRoute("/_auth/agreements/$agreementId/check-in")(
  {
    validateSearch: (search) =>
      z
        .object({
          stage: z.string().optional(),
        })
        .parse(search),
    preSearchFilters: [() => ({ stage: "rental-information" })],
    beforeLoad: ({ context, params: { agreementId } }) => {
      const auth = getAuthFromRouterContext(context);
      return {
        authParams: auth,
        viewAgreementSummaryOptions: fetchAgreementSummaryByIdOptions({
          auth,
          agreementId,
        }),
        viewAgreementOptions: fetchAgreementByIdOptions({
          auth,
          agreementId,
        }),
      };
    },
    loader: async ({ context }) => {
      const { queryClient, viewAgreementOptions, viewAgreementSummaryOptions } =
        context;

      if (!context.auth.isAuthenticated) return;

      const promises = [];

      promises.push(queryClient.ensureQueryData(viewAgreementOptions));

      promises.push(queryClient.ensureQueryData(viewAgreementSummaryOptions));

      await Promise.all(promises);

      return;
    },
  }
);
