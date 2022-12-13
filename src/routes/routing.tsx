import { createRouteConfig, Outlet } from "@tanstack/react-router";
import { z } from "zod";

import { OidcAuthProvider } from "./OidcAuthProvider";
import IndexPage from "../pages/Index/IndexPage";
import AgreementsSearchPage from "../pages/AgreementsSearch/AgreementsSearchPage";
import AgreementViewPage from "../pages/AgreementView/AgreementViewPage";
import CustomerSearchPage from "../pages/CustomerSearch/CustomerSearchPage";

export const rootRoute = createRouteConfig({
  component: () => {
    return (
      <OidcAuthProvider>
        <Outlet />
      </OidcAuthProvider>
    );
  },
});

const indexRoute = rootRoute.createRoute({
  path: "/",
  component: IndexPage,
});

const agreementsRoute = rootRoute.createRoute({ path: "agreements" });

export const agreementFiltersModel = z.object({
  AgreementStatusName: z.string().optional(),
  Statuses: z.number().optional(),
  IsSearchOverdues: z.boolean().optional(),
  EndDate: z
    .preprocess((arg) => {
      if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
    }, z.date())
    .optional(),
});

const agreementsIndexRoute = agreementsRoute.createRoute({
  path: "/",
  component: AgreementsSearchPage,
  validateSearch: z.object({
    page: z.number().min(1).default(1),
    size: z.number().min(1).default(10),
    filters: agreementFiltersModel.optional(),
  }).parse,
  preSearchFilters: [
    (search) => ({
      page: search.page || 1,
      size: search.size || 10,
    }),
  ],
});

const viewAgreementRoute = agreementsRoute.createRoute({
  path: "$agreementId",
  component: AgreementViewPage,
});

const customersRoute = rootRoute.createRoute({ path: "customers" });

export const customerFiltersModel = z.object({
  active: z.boolean().default(true).optional(),
});

const customersIndexRoute = customersRoute.createRoute({
  path: "/",
  component: CustomerSearchPage,
  validateSearch: z.object({
    page: z.number().min(1).default(1),
    size: z.number().min(1).default(10),
    filters: customerFiltersModel.optional(),
  }).parse,
  preSearchFilters: [
    (search) => ({
      page: search.page || 1,
      size: search.size || 10,
    }),
  ],
});

export const routeConfig = rootRoute.addChildren([
  indexRoute,
  agreementsRoute.addChildren([agreementsIndexRoute, viewAgreementRoute]),
  customersRoute.addChildren([customersIndexRoute]),
]);
