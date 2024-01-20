import { FileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { z } from "zod";

import { getAuthFromRouterContext } from "@/utils/auth";
import {
  fetchAgreementByIdOptions,
  fetchAgreementExchangesByIdOptions,
  fetchAgreementNotesByIdOptions,
  fetchAgreementSummaryByIdOptions,
} from "@/utils/query/agreement";

export const Route = new FileRoute("/agreements/$agreementId").createRoute({
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
      viewAgreementSummaryOptions: fetchAgreementSummaryByIdOptions({
        auth,
        agreementId,
      }),
      viewAgreementOptions: fetchAgreementByIdOptions({
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
      viewAgreementSummaryOptions,
      viewAgreementOptions,
      viewTab,
    } = context;
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
        promises.push(queryClient.ensureQueryData(viewAgreementSummaryOptions));
        break;
    }

    await Promise.all(promises);

    return;
  },
  component: lazyRouteComponent(() => import("@/pages/view-agreement")),
});
