import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import {
  fetchAgreementExchangesByIdOptions,
  fetchAgreementNotesByIdOptions,
} from "@/lib/query/agreement";

import { getAuthFromRouterContext } from "@/lib/utils/auth";

export const Route = createFileRoute(
  "/_auth/(agreements)/agreements/$agreementId/"
)({
  validateSearch: (search) =>
    z
      .object({
        tab: z.string().optional(),
      })
      .parse(search),
  preSearchFilters: [(search) => ({ tab: search?.tab || "summary" })],
  beforeLoad: ({ context, search, params: { agreementId } }) => {
    const auth = getAuthFromRouterContext(context);
    return {
      authParams: auth,
      viewAgreementExchangesOptions: fetchAgreementExchangesByIdOptions({
        auth,
        agreementId,
      }),
      viewAgreementNotesOptions: fetchAgreementNotesByIdOptions({
        auth,
        agreementId,
      }),
      viewTab: search?.tab || "",
    };
  },
  loaderDeps: (ctx) => ({ tab: ctx.search?.tab }),
  loader: async ({ context }) => {
    const {
      queryClient,
      viewAgreementExchangesOptions,
      viewAgreementNotesOptions,
      viewAgreementOptions,
      viewTab,
    } = context;

    if (!context.auth.isAuthenticated) return;

    const promises = [];

    promises.push(queryClient.ensureQueryData(viewAgreementOptions));

    switch (viewTab.trim().toLowerCase()) {
      case "exchanges":
        promises.push(
          queryClient.ensureQueryData(viewAgreementExchangesOptions)
        );
        break;
      case "notes":
        promises.push(queryClient.ensureQueryData(viewAgreementNotesOptions));
        break;
      case "summary":
      default:
        break;
    }

    await Promise.all(promises);

    return;
  },
});
