import { createRouteConfig, Outlet } from "@tanstack/react-router";
import { z } from "zod";

import { OidcAuthProvider } from "./OidcAuthProvider";
import AgreementsSearchPage from "../pages/AgreementsSearch/AgreementsSearchPage";
import IndexPage from "../pages/Index/IndexPage";

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

export const agreementFiltersModel = z
  .object({
    AgreementStatusName: z.string().optional(),
    Statuses: z.number().optional(),
    IsSearchOverdues: z.boolean().optional(),
    EndDate: z
      .preprocess((arg) => {
        if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
      }, z.date())
      .optional(),
  })
  .optional();

const agreementsSearchRoute = rootRoute.createRoute({
  path: "/agreements",
  component: AgreementsSearchPage,
  validateSearch: z.object({
    page: z.number().min(1).default(1),
    size: z.number().min(1).default(10),
    filters: agreementFiltersModel,
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
  agreementsSearchRoute,
]);
