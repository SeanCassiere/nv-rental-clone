import { FileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { getAuthFromRouterContext } from "@/utils/auth";
import {
  fetchAgreementByIdOptions,
  fetchAgreementSummaryByIdOptions,
} from "@/utils/query/agreement";

export const Route = new FileRoute(
  "/_auth/agreements/$agreementId/check-in"
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
});
