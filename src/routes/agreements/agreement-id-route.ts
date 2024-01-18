import { lazyRouteComponent, Route } from "@tanstack/react-router";
import { z } from "zod";

import { getAuthFromRouterContext } from "@/utils/auth";
import {
  fetchAgreementByIdOptions,
  fetchAgreementExchangesByIdOptions,
  fetchAgreementNotesByIdOptions,
  fetchAgreementSummaryByIdOptions,
} from "@/utils/query/agreement";

import { agreementsRoute } from ".";

export const agreementPathIdRoute = new Route({
  getParentRoute: () => agreementsRoute,
  path: "$agreementId",
  parseParams: (params) => ({
    agreementId: z.string().parse(params.agreementId),
  }),
  stringifyParams: (params) => ({
    agreementId: `${params.agreementId}`,
  }),
});

export const viewAgreementByIdRoute = new Route({
  getParentRoute: () => agreementPathIdRoute,
  path: "/",
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

export const editAgreementByIdRoute = new Route({
  getParentRoute: () => agreementPathIdRoute,
  path: "edit",
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
  component: lazyRouteComponent(() => import("@/pages/edit-agreement")),
});

export const checkinAgreementByIdRoute = new Route({
  getParentRoute: () => agreementPathIdRoute,
  path: "check-in",
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
