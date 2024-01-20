import { FileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { z } from "zod";

import { getAuthFromRouterContext } from "@/utils/auth";
import {
  fetchAgreementByIdOptions,
  fetchAgreementSummaryByIdOptions,
} from "@/utils/query/agreement";

export const Route = new FileRoute(
  "/agreements/$agreementId/check-in"
).createRoute({
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
    const promises = [];

    promises.push(queryClient.ensureQueryData(viewAgreementOptions));

    promises.push(queryClient.ensureQueryData(viewAgreementSummaryOptions));

    await Promise.all(promises);

    return;
  },
  component: lazyRouteComponent(() => import("@/pages/checkin-agreement")),
});
